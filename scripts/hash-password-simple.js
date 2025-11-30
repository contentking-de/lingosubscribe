// Simple password hasher that works without dependencies
// This uses Node.js built-in crypto module

const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password-simple.js <password>');
  console.error('\nNote: This creates a simple hash. For production, use hash-password.js after npm install');
  process.exit(1);
}

// Simple hash using SHA256 (not as secure as bcrypt, but works without dependencies)
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\nSimple password hash (SHA256):');
console.log(hash);
console.log('\n⚠️  WARNING: This is a simple hash. For production use, run:');
console.log('   npm install');
console.log('   node scripts/hash-password.js "' + password + '"');
console.log('\nAdd the hash to your .env file as ADMIN_PASSWORD_HASH\n');


