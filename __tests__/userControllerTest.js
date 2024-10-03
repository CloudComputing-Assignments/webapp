const request = require('supertest');
const app = require('../index'); // Ensure your app is exported in index.js
const User = require('../model/User');
const SequelizeMock = require('sequelize-mock');

// Mock database and services
jest.mock('../services/userService');
jest.mock('../services/healthzService');

const { getUser, createUser, updateUser } = require('../services/userService');
const { checkDatabaseConnection } = require('../services/healthzService');

// Mock the User model methods
jest.mock('../model/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

describe('UserController', () => {
  beforeEach(() => {
    // Mock the database check
    checkDatabaseConnection.mockResolvedValue(true);
  });

  describe('GET /v1/user/self', () => {
    it('should return user information for authenticated user', async () => {
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe',
        account_created: new Date(),
        account_updated: new Date(),
      };

      getUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/v1/user/self')
        .set('Authorization', 'Basic ' + Buffer.from('johndoe:password').toString('base64'))
        .expect(200);

      expect(response.body).toEqual({
        id: mockUser.id,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        email: mockUser.email,
        account_created: mockUser.account_created.toISOString(),
        account_updated: mockUser.account_updated.toISOString(),
      });
    });

    it('should return 503 if the database is not connected', async () => {
      checkDatabaseConnection.mockResolvedValueOnce(false);

      await request(app)
        .get('/v1/user/self')
        .expect(503);
    });
  });

  describe('POST /v1/user', () => {
    it('should create a new user', async () => {
      const mockNewUser = {
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe',
        account_created: new Date(),
        account_updated: new Date(),
      };

      createUser.mockResolvedValue(mockNewUser);

      const response = await request(app)
        .post('/v1/user')
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'janedoe',
          password: 'password',
        })
        .expect(201);

      expect(response.body).toEqual({
        id: mockNewUser.id,
        first_name: mockNewUser.first_name,
        last_name: mockNewUser.last_name,
        email: mockNewUser.email,
        account_created: mockNewUser.account_created.toISOString(),
        account_updated: mockNewUser.account_updated.toISOString(),
      });
    });

    it('should return 400 for invalid request body', async () => {
      await request(app)
        .post('/v1/user')
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
        })
        .expect(400);
    });
  });

  describe('PUT /v1/user/self', () => {
    it('should update the user when valid credentials are provided', async () => {
      updateUser.mockResolvedValue({});

      await request(app)
        .put('/v1/user/self')
        .set('Authorization', 'Basic ' + Buffer.from('johndoe:password').toString('base64'))
        .send({
          first_name: 'UpdatedFirst',
          last_name: 'UpdatedLast',
          password: 'newpassword',
        })
        .expect(204);
    });
  });
});
