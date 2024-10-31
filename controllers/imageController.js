const {
  createImage,
  deleteImage,
  getImage,
} = require("../services/imageService");
const healthzService = require("../services/healthzService");
const { uploadImageToS3, deleteImagesFromS3 } = require("../util/S3");
const User = require("../model/User");
const logger = require("../util/logger");
const client = require("../util/statsD");

// Controller for creating a new image
async function postImage(req, res) {
  client.increment("post.image.create");
  const startTime = Date.now();
  try {
    logger.info("Checking database connection for image upload");
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
    if (!isDatabaseConnected) {
      logger.warn("Database connection unavailable");
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
    logger.error("Error checking database connection", { error });
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
    // Assuming username is your user ID or fetch user ID from DB using the username
    const userId = req.user.id;
    const file = req.file;
    logger.info("Starting image upload process", { userId });
    if (!file || file === undefined) {
      logger.warn("No file uploaded in the request");
      return res.status(400).send();
    }
    if (file.mimetype.includes("image/") === false) {
      logger.warn("File is not an image", { mimetype: file.mimetype });
      return res.status(400).send();
    }

    logger.info("Checking if profile picture already exists", { userId });
    const profilePicFound = await getImage(req);

    if (profilePicFound) {
      logger.warn("Profile picture already exists", { userId });
      res.status(400).send();
    } else {
      const basePath = `${userId}/`;
      logger.info("Uploading image to S3", { basePath });
      const s3_response = await uploadImageToS3(file, basePath);

      const duration1 = Date.now() - startTime;
      client.timing('post.imageAWS.duration', duration1);


      logger.info("Creating image record in database", { userId });
      const sendProfilePic = await createImage(userId, req, s3_response);
      // console.log(sendProfilePic);
      if (sendProfilePic) {
        logger.info("Image successfully uploaded and database record created", {
          userId,
          imageUrl: s3_response.Location,
        });
        res.status(201).json(sendProfilePic); // Respond with the created image and a 201 status
      } else {
        logger.error("Failed to create image record in database", { userId });
        res.status(400).send();
      }
    }
  } catch (error) {
    logger.error("Error creating image", { error });
    console.error("Error creating image:", error);
    res.status(400).send(); // Respond with an error message
  } finally {
    const duration = Date.now() - startTime;
    client.timing("post.image.duration", duration);
  }
}

// Controller for deleting the user's image
async function destroyImage(req, res) {
  client.increment("delete.image.destroy");
  const startTime = Date.now();
  try {
    logger.info("Checking database connection for image upload");
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
    if (!isDatabaseConnected) {
      logger.warn("Database connection unavailable");
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
    logger.error("Error checking database connection", { error });
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
    logger.info("Initiating image delete process", { userId: req.user.id });
    const userId = req.user.id;

    logger.info("Deleting images from S3", { userId });
    await deleteImagesFromS3(userId);
    
      const duration1 = Date.now() - startTime;
      client.timing('delete.userAWS.duration', duration1);
    

    logger.info("Deleting image record from database", { userId });
    const imageDeleted = await deleteImage(userId);
    if (imageDeleted !== false) {
      logger.info("Image successfully deleted", { userId });
      res.status(204).send();
    } else {
      logger.warn("Image not found for deletion", { userId });
      res.status(404).send();
    }
  } catch (error) {
    logger.error("Error deleting image", { userId: req.user.id, error });
    console.error("Error deleting image:", error);
    res.status(404).send(); // Respond with an error message
  }finally{
    const duration = Date.now() - startTime;
    client.timing('delete.image.duration', duration);
  }
}

// Controller for getting the user's image
async function findImage(req, res) {
  client.increment("get.image.fetch");
  const startTime = Date.now();
  try {
    logger.info("Checking database connection for image upload");
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
    if (!isDatabaseConnected) {
      logger.warn("Database connection unavailable");
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
    logger.error("Error checking database connection", { error });
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
    logger.info("Retrieving image for user", { userId: req.user.id });
    const image = await getImage(req); // Call getImage to retrieve the user's image
    if (image !== null) {
      logger.info("Image retrieved successfully", { userId: req.user.id });
      res.status(200).json(image); // Respond with the image data
    } else {
      logger.warn("Image not found for user", { userId: req.user.id });
      res.status(404).send(); // Respond with a 404 status code if the image is
    }
  } catch (error) {
    logger.error("Error retrieving image", { userId: req.user.id, error });
    console.error("Error retrieving image:", error);
    res.status(404).send(); // Respond with a 404 status if the image is not found
  }finally{
    const duration = Date.now() - startTime;
    client.timing('get.image.duration', duration);
  }
}

module.exports = { postImage, destroyImage, findImage };
