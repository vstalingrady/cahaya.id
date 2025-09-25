const fs = require('fs');
const path = require('path');

// Service names mapped by length
const servicesByLength = {
  3: ['BCA', 'BNI', 'OVO'],
  4: ['GOPAY', 'BIBIT'],
  5: ['PINTU'],
  7: ['MANDIRI', 'KREDIVO']
};

function replaceSequences(content) {
  let result = content;

  // Process from longest to shortest to avoid conflicts
  const lengths = Object.keys(servicesByLength).sort((a, b) => b - a);

  lengths.forEach(length => {
    const services = servicesByLength[length];
    const slashSequence = '/'.repeat(length);

    // Find all occurrences and replace with random service from the list
    let index = 0;
    while ((index = result.indexOf(slashSequence, index)) !== -1) {
      const randomService = services[Math.floor(Math.random() * services.length)];
      result = result.substring(0, index) + randomService + result.substring(index + length);
      index += randomService.length;
    }
  });

  return result;
}

function main() {
  const filePath = path.join(__dirname, 'public', 'indonesia_archipelago_negative.txt');

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const modifiedContent = replaceSequences(content);

    fs.writeFileSync(filePath, modifiedContent, 'utf8');

    console.log('✅ ASCII art updated successfully!');
    console.log('Service names embedded in the art:');
    Object.entries(servicesByLength).forEach(([length, services]) => {
      console.log(`- ${length} slashes → ${services.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Error updating ASCII art:', error.message);
    process.exit(1);
  }
}

main();