const express = require("express");
const app = express();
const {
    getImagesData,
    saveOnlineImages,
    getImageData
} = require("./queryFunctions");
const { uploadS3 } = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { s3Url } = require("./config");
const path = require("path");

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////////////////////////////////////////////////////////////
//////////////////////BOILERPLATE ABOVE///////////////////////
//////////////////////////////////////////////////////////////

app.use(express.static("./public"));
app.use(express.static("./css"));

app.get("/imagesdata", (req, res) => {
    getImagesData().then(data => {
        res.json(data);
    });
});

app.post("/uploads", uploader.single("file"), uploadS3, (req, res) => {
    console.log("REQ BODYYY------------", req.body);
    console.log("REQ FIIIIILE----------", req.file);
    if (req.file) {
        saveOnlineImages(
            s3Url + req.file.filename,
            req.body.userName,
            req.body.title,
            req.body.description
        )
            .then(allReturingData => {
                console.log("SAVED RESUUULT", allReturingData[0]);
                res.json({
                    imageData: allReturingData[0]
                });
            })
            .catch(e => console.log("CATCH ERROR", e));
    }
});

app.get("/clickedimage/:id", (req, res) => {
    getImageData(req.params.id).then(imageId => {
        console.log("GET RESPONSE WITH IMG DATA:", imageId);
        res.json(imageId[0]); //sends pure object with all image data
    });
});

app.listen(8080, () => console.log("Server is listening: "));
