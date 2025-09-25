
// Temporarily disabled server actions for static export
// // Temporarily disabled for standalone APK build
// 'use server';

import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Check if the encryption key is set and is the correct length.
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    console.error("FATAL: ENCRYPTION_KEY environment variable is not set or is not 32 characters long.");
    // In a real app, you might want to prevent the app from starting.
    // For this prototype, we'll throw an error when the functions are called if the key is missing.
}

function getKey() {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
        throw new Error('ENCRYPTION_KEY environment variable is not set or is not 32 characters long. Please set it in your .env file.');
    }
    return Buffer.from(ENCRYPTION_KEY, 'utf-8');
}


/**
 * Encrypts a string using AES-256-GCM.
 * @param text The string to encrypt.
 * @returns An object containing the initialization vector (iv) and the encrypted data, both as hex strings.
 */
export async function encrypt(text: string): Promise<{ iv: string; encrypted: string }> {
    const key = getKey();
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the text
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    // Get the authentication tag, which is crucial for GCM mode's integrity check
    const tag = cipher.getAuthTag();

    // Return the IV and the combined encrypted data + auth tag
    return {
        iv: iv.toString('hex'),
        encrypted: Buffer.concat([encrypted, tag]).toString('hex'),
    };
}

/**
 * Decrypts a string that was encrypted with the `encrypt` function.
 * @param data An object containing the hex-encoded iv and encrypted data.
 * @returns The original decrypted string.
 */
export async function decrypt(data: { iv: string; encrypted: string }): Promise<string> {
    const key = getKey();
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedTextAndTag = Buffer.from(data.encrypted, 'hex');

    // Extract the authentication tag from the end of the encrypted data
    const tag = encryptedTextAndTag.slice(-16);
    // Extract the actual encrypted text
    const encrypted = encryptedTextAndTag.slice(0, -16);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    // Set the authentication tag to allow verification
    decipher.setAuthTag(tag);

    // Decrypt the data and return it as a UTF-8 string
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}
