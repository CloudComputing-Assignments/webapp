require("dotenv").config(); // Make sure to require dotenv at the top
const AWS = require("aws-sdk");
const fs = require("fs"); // If you're uploading from a file system

// Configure the AWS region and credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const uploadImageToS3 = async (file, basePath) => {
  const bucketName = process.env.AWS_BUCKET_NAME; // Get bucket name from env variables

  try {
    // Read content from the file
    const fileContent = fs.readFileSync(file.path);

    // Set up S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: basePath + Date.now() + file.originalname, // File name you want to save as in S3
      Body: fileContent,
    };

    // Uploading files to the bucket
    const data = await s3.upload(params).promise();
    return data.Location; // Returns the URL of the uploaded file
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};

const deleteImagesFromS3 = async (userId) => {
  const bucketName = process.env.AWS_BUCKET_NAME; // Get bucket name from env variables
  const prefix = `${userId}/`; // Set prefix to the user ID

  // List objects under the user's prefix
  const listParams = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  console.log("List Params: ", listParams);

  try {
    const listedObjects = await s3.listObjectsV2(listParams).promise();
    console.log("Listed Objects: ", listedObjects);

    if (listedObjects.Contents.length === 0) {
      console.log(`No images found for user: ${userId}`);
      return; // Nothing to delete
    }

    // Prepare delete parameters
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })), // Map the keys of the objects to delete
      },
    };
    console.log(deleteParams.Delete.Objects);
    console.log("Delete Params: ", deleteParams);

    // Delete the objects from the S3 bucket
    await s3.deleteObjects(deleteParams).promise();
    console.log(`Successfully deleted all images for user: ${userId}`);
  } catch (err) {
    console.error("Error deleting images:", err);
    throw err; // Rethrow the error for further handling if needed
  }
};

module.exports = { uploadImageToS3, deleteImagesFromS3 };
