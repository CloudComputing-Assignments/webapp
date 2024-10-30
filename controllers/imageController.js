const {
  createImage,
  deleteImage,
  getImage,
} = require("../services/ImageService");
const healthzService = require("../services/healthzService");
const { uploadImageToS3, deleteImagesFromS3 } = require("../util/S3");
const User = require("../model/User");

// Controller for creating a new image
async function postImage(req, res) {
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
    // Assuming username is your user ID or fetch user ID from DB using the username
    const userId = req.user.id;
    const file = req.file;
    if (!file || file === undefined) {
      return res.status(400).send();
    }
    if (file.mimetype.includes("image/") === false) {
      return res.status(400).send();
    }

    //const ppexist get pp from db
    const profilePicFound = await getImage(req);

    if (profilePicFound) {
      res.status(400).send();
    } else {
      const basePath = `${userId}/`;
      const s3_response = await uploadImageToS3(file, basePath);

      const sendProfilePic = await createImage(userId, req, s3_response);
      // console.log(sendProfilePic);
      if (sendProfilePic) {
        res.status(201).json(sendProfilePic); // Respond with the created image and a 201 status
      }
    }
    //if(ppexist) then return 400
    //const uploadpp
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(400).send(); // Respond with an error message
  }
}

// Controller for deleting the user's image
async function destroyImage(req, res) {
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
    const userId = req.user.id;
    await deleteImagesFromS3(userId);
    const imageDeleted = await deleteImage(userId);
    if (imageDeleted !== false) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(404).send(); // Respond with an error message
  }
}

// Controller for getting the user's image
async function findImage(req, res) {
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
    const image = await getImage(req); // Call getImage to retrieve the user's image
    if (image !== null) {
      res.status(200).json(image); // Respond with the image data
    } else {
      res.status(404).send(); // Respond with a 404 status code if the image is
    }
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(404).send(); // Respond with a 404 status if the image is not found
  }
}

module.exports = { postImage, destroyImage, findImage };
