const User = require('../model/User');
const client = require('../util/statsD');

async function createUser(first_name, last_name, password, email ) {
    const startTime = Date.now();
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User Exists!');
    }
    if(!first_name.trim() || !last_name.trim() || !password.trim() || !email.trim())
    {
        throw new Error('Invalid Input');
    }
    console.log("creating new user");
    const newUser = await User.create({
        first_name,
        last_name,
        password,
        email,
      });


    const duration = Date.now() - startTime;
    client.timing('post.userdb.duration', duration);

    return newUser;
}

async function getUser(authHeader) {
    const startTime = Date.now();
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
    
      throw new Error('User not found');
    }
    if (!user.comparePassword(password)) {
     
      throw new Error('Invalid password');
    }
   

    const duration = Date.now() - startTime;
    client.timing('get.userdb.duration', duration);

    return user;
  }

  async function updateUser(authHeader, first_name, last_name, newpass, user_email) {
    // Decode the authHeader to get the email and password
    const startTime = Date.now();
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    // Find the user by the email decoded from the authHeader
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    // Check if the password matches the user's password
    if (!user.comparePassword(password)) {
        console.log('Password', password);
        throw new Error('Invalid password');
    }

    // Check if any of the input fields are invalid (empty)
    if (!first_name.trim() || !last_name.trim() || !newpass.trim() || !user_email.trim()) {
        throw new Error('Invalid Input');
    }

    // Check if the provided user_email matches the authenticated user's email
    if (user.email !== user_email) {
        throw new Error('Email mismatch. You can only update your own details.');
    }

    // If the email matches, proceed with the update
    if (first_name) {
        user.first_name = first_name;
    }
    if (last_name) {
        user.last_name = last_name;
    }
    if (newpass) {
        user.updatePassword(newpass); 
    }
    
    // Update the account_updated field to the current date
    user.account_updated = new Date();
    
    // Save the updated user details to the database
    await user.save();

    const duration = Date.now() - startTime;
    client.timing('put.userdb.duration', duration);
 
    return user;
  }

module.exports = { createUser, getUser, updateUser }