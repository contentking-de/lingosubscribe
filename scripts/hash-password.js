const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('\nPassword hash:');
    console.log(hash);
    console.log('\nAdd this to your .env file as ADMIN_PASSWORD_HASH\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error hashing password:', error.message);
    console.error('\nMake sure you have installed dependencies: npm install');
    process.exit(1);
  });

