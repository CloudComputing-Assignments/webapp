const request = require("supertest");
const { app, startServer } = require("../index");
const { sequelize } = require("../config/config"); 
const suffix = Date.now().toString(); // Generate a dynamic suffix for email uniqueness

describe("Integration Tests", () => {
  let server;
  const userData = {
    first_name: "Jane",
    last_name: "Doe",
    password: "password",
    email: `jane_${suffix}@email.com`, // Dynamically generated email
  };
  const encodeValue = Buffer.from(`${userData.email}:${userData.password}`).toString("base64");
  const authHeader = `Basic ${encodeValue}`;

  beforeAll(async () => {
    try {
      await sequelize.sync(); // Ensure DB is synced
      server = startServer(); // Start the server
    } catch (error) {
      console.error("Error during setup:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Cleanup: remove the user created during the tests
      await sequelize.close();
      await new Promise((resolve) => server.close(resolve)); // Ensure server closes properly
    } catch (error) {
      console.error("Error during teardown:", error);
      throw error;
    }
  });

  it("Test 1: Create an account and validate account existence with GET call", async () => {
    // Create user
    const createUserResponse = await request(app).post("/v1/user").send(userData);
    expect(createUserResponse.status).toBe(201);

    // Validate user existence
    const getUserResponse = await request(app)
      .get("/v1/user/self")
      .set("Authorization", authHeader); // Set auth header using created user credentials
    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body.email).toBe(userData.email); // Verify email
  });

  it("Test 2: Update the account and validate the changes", async () => {
    const updatedUserData = {
      first_name: "firstnameupdated",
      last_name: "lastnameupdated",
      email: userData.email, // Keep the email the same
      password: "newpassword", // New password
    };

    // Update the user
    const updateUserResponse = await request(app)
      .put(`/v1/user/self`)
      .set("Authorization", authHeader) // Use the original credentials
      .send(updatedUserData);
    expect(updateUserResponse.status).toBe(204);

    // Generate new auth header with updated password
    const newAuthHeader = `Basic ${Buffer.from(`${updatedUserData.email}:${updatedUserData.password}`).toString("base64")}`;

    // Validate the updated user
    const getUserResponseAfterUpdate = await request(app)
      .get(`/v1/user/self`)
      .set("Authorization", newAuthHeader); // Use the updated credentials
    expect(getUserResponseAfterUpdate.status).toBe(200);
    expect(getUserResponseAfterUpdate.body.first_name).toBe(updatedUserData.first_name);
    expect(getUserResponseAfterUpdate.body.last_name).toBe(updatedUserData.last_name);
    expect(getUserResponseAfterUpdate.body.email).toBe(userData.email); // Verify email didn't change
  });
});

module.exports = { sequelize };
