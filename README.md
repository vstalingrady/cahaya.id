# Cuan - All Your Money, In One Place

This is a Next.js application designed to be a personal finance dashboard. It's built with Next.js, TypeScript, Tailwind CSS, ShadCN UI components, and Genkit for AI features.

## Getting Started: Local Development Setup

To run this project on your local machine, follow these steps.

### 1. Clone the Repository

First, you need to clone the project's source code from its Git repository.

```bash
# Replace the URL with your actual repository URL
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Set Up Environment Variables

This project requires Firebase credentials to connect to its backend services.

1.  Create a new file named `.env.local` in the root of your project.
2.  Copy the content of `.env` into `.env.local`.
3.  Go to your [Firebase Console](https://console.firebase.google.com/), select your project, go to **Project Settings** (the gear icon), and find your web app's configuration.
4.  Fill in the values in your `.env.local` file with your Firebase project credentials. It should look like this:

```plaintext
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...

# Firebase App Check (reCAPTCHA v3)
# Get this from Project Settings > App Check > Your App > reCAPTCHA v3
NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY=...
```

### 3. Install Dependencies

Install all the necessary packages using npm.

```bash
npm install
```

### 4. Run the Development Servers

This application requires two development servers to be running at the same time in separate terminal windows.

*   **Terminal 1: Next.js App**
    This server runs the user interface and frontend.

    ```bash
    npm run dev
    ```
    Your app will be available at [http://localhost:9003](http://localhost:9003).

*   **Terminal 2: Genkit AI Flows**
    This server runs the AI agents and flows.

    ```bash
    npm run genkit:dev
    ```
    This allows the Next.js app to communicate with your AI features.

You are now all set up to develop locally!

hey its me test
