const { exec } = require('child_process');

// Run next build and capture webpack stats
exec('next build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  
  console.log('Build completed successfully');
  console.log('Check the .next directory for bundle analysis files');
});