const { createUser, getUser, updateUser } = require('../services/userService');
const User = require('../model/User');
const SequelizeMock = require('sequelize-mock');

// Mock the User model
const dbMock = new SequelizeMock();
const UserMock = dbMock.define('User', {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe',
  password: 'password',
});

User.findOne = jest.fn();
User.create = jest.fn();

describe('UserService', () => {
  afterAll(async () => {
    // Cleanup: close the Sequelize connection if necessary
    await User.sequelize.close(); // Ensure this matches how your Sequelize instance is set up
  });

  describe('createUser', () => {
    it('should create a new user when valid inputs are provided', async () => {
      const newUser = {
        id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe',
        password: 'newpass',
      };

      User.create.mockResolvedValue(newUser);
      
      const result = await createUser(newUser.first_name, newUser.last_name, newUser.password, newUser.email);
      expect(result).toEqual(newUser);
    });

    it('should throw an error if the user already exists', async () => {
      User.findOne.mockResolvedValueOnce({ email: 'existinguser' });

      await expect(createUser('John', 'Doe', 'password', 'existinguser'))
        .rejects
        .toThrow('User Exists!');
    });
  });

  describe('getUser', () => {
    it('should return a user when valid credentials are provided', async () => {
      User.findOne.mockResolvedValueOnce({
        email: 'johndoe',
        comparePassword: jest.fn(() => true),
      });

      const authHeader = 'Basic ' + Buffer.from('johndoe:password').toString('base64');
      const user = await getUser(authHeader);

      expect(user.email).toBe('johndoe');
    });

    it('should throw an error if the user is not found', async () => {
      User.findOne.mockResolvedValueOnce(null);

      const authHeader = 'Basic ' + Buffer.from('invaliduser:password').toString('base64');
      await expect(getUser(authHeader)).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user details when valid inputs are provided', async () => {
      User.findOne.mockResolvedValueOnce({
        email: 'johndoe',
        comparePassword: jest.fn(() => true),
        save: jest.fn(),
        updatePassword: jest.fn(),
      });

      const authHeader = 'Basic ' + Buffer.from('johndoe:password').toString('base64');
      await expect(updateUser(authHeader, 'John', 'Doe', 'newpassword')).resolves.not.toThrow();
    });

    it('should throw an error if the password is invalid', async () => {
      User.findOne.mockResolvedValueOnce({
        email: 'johndoe',
        comparePassword: jest.fn(() => false),
      });

      const authHeader = 'Basic ' + Buffer.from('johndoe:password').toString('base64');
      await expect(updateUser(authHeader, 'John', 'Doe', 'newpassword')).rejects.toThrow('Invalid password');
    });
  });

  // Mock the User.sync() to prevent actual database interactions
  jest.spyOn(User.sequelize, 'sync').mockResolvedValueOnce();
});
