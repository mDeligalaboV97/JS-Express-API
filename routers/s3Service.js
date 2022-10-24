require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const uuid = require('uuid').v4 
const sharp = require('sharp')
const {addImage} = require("../repository")

const round = (number, decimalPlaces) => {
    const factorOfTen = Math.pow(10, decimalPlaces)
    return Math.round(number * factorOfTen) / factorOfTen
  }

exports.s3Upload = async (files) => {
    const s3client = new S3Client()

    for (let i = 0; i < files.length; i++){
        files[i]["resizedImageBuffer"] = await sharp(files[i].buffer).resize({height:256, width:256, fit:"contain"}).toBuffer();
    }

    const params = files.map(file => {
        return {
            tumbnail:{
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `uploads/tumbnails/${uuid()}-tumbnail-${file.originalname}`,
                Body: file.resizedImageBuffer,
                ContentType: file.mimetype
            },
            realImage:{
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `uploads/${uuid()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype
            }
        }
    });

    // Uploading the images to the AWS S3
    const tumbnailResults = await Promise.all(params.map(param => s3client.send(new PutObjectCommand(param.tumbnail))));
    const realImageResults = await Promise.all(params.map(param => s3client.send(new PutObjectCommand(param.realImage))));

    // Inserting the data to in the DB
    for (var i = 0; i < tumbnailResults.length; i++){
        addImage({image_tag: realImageResults[i].ETag, tbm_image_tag:tumbnailResults[i].ETag, lat:round(Math.random()*24, 5), long:round(Math.random()*24, 5)})
    }


    return {tumbnails: tumbnailResults, realImages: realImageResults}
}