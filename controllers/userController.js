const userService = require("../services/userService");
const healthzService = require("../services/healthzService");
const client = require("../util/statsD");

async function getUser(req, res) {
  client.increment("get.user.fetch");
  const startTime = Date.now();
  try {
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
    if (!isDatabaseConnected) {
      return res
        .status(503)
        .set({
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "X-Requested-With, Content-Type, Accept, Origin",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        })
        .send();
    }
  } catch (error) {
    console.error("Error checking database connection:", error);
    return res
      .status(503)
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send();
  }

  try {
    // Validate that the body is empty for the GET request
    if (Object.keys(req.body).length > 0) {
      return res
        .status(400)
        .set({
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "X-Requested-With, Content-Type, Accept, Origin",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        })
        .send();
    }

    const authHeader = req.headers.authorization;
    const User = await userService.getUser(authHeader);

    const responseObject = {
      id: User.id,
      first_name: User.first_name,
      last_name: User.last_name,
      email: User.email,
      account_created: User.account_created.toISOString(),
      account_updated: User.account_updated.toISOString(),
    };

    res
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .status(200)
      .json(responseObject);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(401)
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send();
  } finally {
    const duration = Date.now() - startTime;
    client.timing("get.user.duration", duration);
  }
}

async function createUser(req, res) {
  client.increment("post.user.create");
  const startTime = Date.now();
  try {
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
    if (!isDatabaseConnected) {
      return res
        .status(503)
        .set({
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "X-Requested-With, Content-Type, Accept, Origin",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        })
        .send();
    }
  } catch (error) {
    console.error("Error checking database connection:", error);
    return res
      .status(503)
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send();
  }
  try {
    if (Object.keys(req.body).length !== 4) {
      res.status(400).header("Cache-Control", "no-cache").send();
      return;
    }
    const seenKeys = new Set();

    for (const key in req.body) {
      if (seenKeys.has(key)) {
        console.log("key:", key);
        return res
          .status(400)
          .json({ error: "Duplicate keys in the request body" });
      }

      seenKeys.add(key);
    }

    const updatedFields = Object.keys(req.body);
    const allowedFields = ["first_name", "last_name", "password", "email"];

    if (!updatedFields.every((field) => allowedFields.includes(field))) {
      return res.status(400).send();
    }
    const { first_name, last_name, password, email } = req.body;
    const newUser = await userService.createUser(
      first_name,
      last_name,
      password,
      email
    );

    const responseObject = {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      account_created: newUser.account_created.toISOString(),
      account_updated: newUser.account_updated.toISOString(),
    };
    res.set({
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers":
        "X-Requested-With, Content-Type, Accept, Origin",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    });

    res.status(201).json(responseObject);
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }finally{
    const duration = Date.now() - startTime;
    client.timing('post.user.duration', duration);
  }
}

async function updateUser(req, res) {
  client.increment("put.user.update");
  const startTime = Date.now();
  try {
    // Check database connection
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
    if (!isDatabaseConnected) {
      return res
        .status(503)
        .set({
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "X-Requested-With, Content-Type, Accept, Origin",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        })
        .send();
    }
  } catch (error) {
    console.error("Error checking database connection:", error);
    return res
      .status(503)
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send();
  }

  try {
    // Validate the request body
    const validationResult = validateRequestBody(req.body);
    if (!validationResult.isValid) {
      return res
        .status(400)
        .set({
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "X-Requested-With, Content-Type, Accept, Origin",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        })
        .send();
    }

    const authHeader = req.headers.authorization;
    const { first_name, last_name, password, email } = req.body; // Include email in destructuring

    // Call the user service to update the user, but ignore email
    const updatedUser = await userService.updateUser(
      authHeader,
      first_name,
      last_name,
      password,
      email
    );

    // Send a no-content response if the update is successful
    return res
      .status(204)
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send();
  } catch (error) {
    console.error("An error occurred while updating the user:", error);
    return res
      .status(400)
      .set({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept, Origin",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send();
  }finally{
    const duration = Date.now() - startTime;
    client.timing('put.user.duration', duration);
  }
}

// Function to validate request body
function validateRequestBody(body) {
  const allowedFields = ["first_name", "last_name", "password", "email"];
  const updatedFields = Object.keys(body);

  if (updatedFields.length !== 4) {
    return { isValid: false };
  }

  if (!updatedFields.every((field) => allowedFields.includes(field))) {
    return { isValid: false };
  }

  // Additional validation for non-empty fields
  if (
    !body.first_name.trim() ||
    !body.last_name.trim() ||
    !body.password.trim() ||
    !body.email.trim()
  ) {
    return { isValid: false };
  }

  return { isValid: true };
}

module.exports = { getUser, createUser, updateUser };
