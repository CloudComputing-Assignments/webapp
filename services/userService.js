const User = require('../model/User');

async function createUser(first_name, last_name, password, email ) {
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
    return newUser;
}

async function getUser(authHeader) {
  
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
   
    return user;
  }

  async function updateUser(authHeader, first_name, last_name, newpass, user_email) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.comparePassword(password)) {
      console.log('Password)',password);
      throw new Error('Invalid password');
    }
    if(!first_name.trim() || !last_name.trim() || !newpass.trim() || !user_email.trim())
    {
      throw new Error('Invalid Input');
    }
    if(first_name)
    user.first_name = first_name;
    if(last_name)
    user.last_name = last_name;
    if(password)
    user.updatePassword(newpass); 
    user.account_updated = new Date();
    await user.save();
    return user;
  }

module.exports = { createUser, getUser, updateUser }