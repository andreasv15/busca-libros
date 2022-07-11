const router = require("express").Router();
const uploader = require("../middleware/cloudinary")


// esta ruta solo va a enviar una imagen a cloudinary y recibe la url
router.post("/", uploader.single("image"), (req, res, next) => {

    //console.log("routes cloudi: ", req.file.path); // img de cloudinary
    
    res.json(req.file.path);
    
})


module.exports = router;
