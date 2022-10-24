const express = require('express');
const multer = require('multer');
const { s3Upload } = require('./s3Service');
const router = express.Router();
const repository = require('../repository')


const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const upload = multer({ storage, 
    fileFilter})

router.get('/', repository.getImages) 

router.get('/:min_lat/:max_lat/:min_long/:max_long', repository.getImagesWithFilter) 

router.post('/upload-image', upload.array("images"), async (req, res) => {
    try{
        const results = await s3Upload(req.files)

        return res.json(results)
    } catch (err){
        console.log(err)
    }
});




module.exports = router
