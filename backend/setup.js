const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
MONGODB_URI=mongodb+srv://admin:Daniyal123@lost-and-found.hcproks.mongodb.net/?retryWrites=true&w=majority&appName=lost-and-found
JWT_SECRET=lost_and_found_secret_key_2024`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('Environment variables have been set up successfully!'); 