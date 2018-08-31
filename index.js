const express = require("express");
const app = express();
const {
    getImagesData,
    getMoreImages,
    saveOnlineImages,
    getImageData,
    saveComments,
    getComments,
    lastImage
} = require("./queryFunctions");
const { uploadS3 } = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { s3Url } = require("./config");
const path = require("path");
app.use(require("body-parser").json());

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
    Promise.all([getImagesData(), lastImage()]).then(([data, lastImage]) => {
        console.log(lastImage[0].id); //id
        res.json({
            queryData: data,
            lastId: lastImage[0].id
        });
    });
});

app.get("/imagesdata/:lastImageId", (req, res) => {
    Promise.all([getMoreImages(req.params.lastImageId), lastImage()]).then(
        ([moreImages, lastImage]) => {
            console.log(lastImage[0].id); //id
            res.json({
                queryData: moreImages,
                lastId: lastImage[0].id
            });
        }
    );
});

app.post("/uploads", uploader.single("file"), uploadS3, (req, res) => {
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
    getImageData(req.params.id)
        .then(images => {
            // console.log("GET RESPONSE WITH IMG DATA:", imageId);
            res.json(images[0]); //sends pure object with all image data
        })
        .catch(e => {
            console.log(e);
            res.json();
        });
});

app.get("/all-image-comments/:id", (req, res) => {
    // console.log("REQ PARAMS ID", req.params.id);
    getComments(req.params.id)
        .then(imageComments => {
            // console.log("GET RESPONSE WITH COMMENTS:", imageComments);
            res.json(imageComments); //sends pure object with all comments data
        })
        .catch(e => {
            console.log("ERROR--->", e);
            res.sendStatus(500);
        });
});

app.post("/post-comments", (req, res) => {
    saveComments(req.body.image_id, req.body.userName, req.body.comment).then(
        commentData => {
            // console.log("RETURNED ID VALUE", commentData[0]);
            res.json(commentData[0]);
        }
    );
});

app.listen(8080, () => console.log("Server is listening: "));
