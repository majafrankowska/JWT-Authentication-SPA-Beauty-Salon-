import bcrypt from "bcrypt";

async function generateHash() {
    const hashedPassword = await bcrypt.hash("type_new_password_here", 10);
    console.log("Hashed password:", hashedPassword);
}

generateHash();

//npm install bcrypt 
// odpala się wpisując node hashNewPassword.js w konsoli
