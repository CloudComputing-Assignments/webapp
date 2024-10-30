const Image = require("../model/Image");
const User = require("../model/User");
const { getUser } = require("./userService"); // Importing getUser from UserService
const multer = require("multer");
const upload = multer({
  dest: __dirname + "/upload",
});

// Create a new image for the authenticated user
async function createImage(userId, req, url) {
  // Check if the user already has an image
  const existingImage = await Image.findOne({ where: { user_id: userId } });
  if (existingImage) {
    throw new Error(
      "User can only have one image. Please delete the existing image before adding a new one."
    );
  }

  // Create the new image
  const newImage = await Image.create({
    file_name: req.file.originalname, // Assuming profilePic contains the file name
    url: url, // Set the constructed URL
    user_id: userId,
  });

  return newImage;
}

// Delete the user's image
async function deleteImage(userId) {
  // Find the existing image associated with the user
  const image = await Image.findOne({ where: { user_id: userId } });
  if (!image) {
    return false;
  }

  // Delete the image
  try {
    await image.destroy();
    return true;
  } catch {
    throw new Error("Image could not be deleted.");
  }
}

// Get the user's image
async function getImage(req) {
  // Get the authenticated user

  // Find the existing image associated with the user
  const image = await Image.findOne({ where: { user_id: req.user.id } });
  if (!image) {
    return null;
  }

  return image;
}

module.exports = { createImage, deleteImage, getImage };
