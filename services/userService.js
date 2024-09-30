const User = require('../model/User');

async function createUser(first_name, last_name, password, username ) {

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        throw new Error('User Exists!');
    }
    if(!first_name.trim() || !last_name.trim() || !password.trim() || !username.trim())
    {
        throw new Error('Invalid Input');
    }
    console.log("creating new user");
    const newUser = await User.create({
        first_name,
        last_name,
        password,
        username,
      });
    return newUser;
}

module.exports = { createUser }