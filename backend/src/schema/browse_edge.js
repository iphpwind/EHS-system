const { exec } = require('child_process');
const path = require('path');

// Open Edge browser with the target URL
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = 'http://222.133.13.78:8088/';

console.log('Opening Edge browser...');
console.log('Please login with:');
console.log('  Account: 13791358848');
console.log('  Password: 123456ABC');
console.log('  Captcha: 9903');
console.log('');
console.log('After logging in, please take screenshots of:');
console.log('1. Homepage/dashboard');
console.log('2. Expanded sidebar menu');
console.log('3. Training module pages');
console.log('4. Safety operation pages');
console.log('5. Any other pages you want to replicate');

const child = exec(`"${edgePath}" "${url}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error opening Edge:', error);
    return;
  }
});

console.log('Edge browser launched. Press Ctrl+C to close this window.');
