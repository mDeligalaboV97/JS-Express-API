const pool = require("./db")

const getImages = (req, res) => {
    pool.query("SELECT * FROM IMAGE", (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows)
    })
}

const getImagesWithFilter = (req, res) => {
    pool.query("SELECT * FROM IMAGE WHERE lat >= $1 AND lat <= $2 AND long >= $3 AND long <= $4", 
    [req.params.min_lat, req.params.max_lat, req.params.min_long, req.params.max_long], 
    (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows)
    })
}

const addImage = (image) => {
    const { image_tag, tbm_image_tag, lat, long} = image
    pool.query("insert into image (image_tag, tmb_image_tag, lat, long) values ($1, $2, $3, $4)", [image_tag, tbm_image_tag, lat, long], (error, results) => {
        if(error) throw error;
    });
}

module.exports = {
    getImages,
    addImage,
    getImagesWithFilter
};