const crypto = require('crypto');
const fs = require('fs');

// Generate a random 64-byte secret
const secret = crypto.randomBytes(64).toString('hex');

// Save the secret to .env file
fs.appendFileSync('.env', `JWT_SECRET=${secret}\n`);

console.log('JWT Secret generated and saved to .env');
