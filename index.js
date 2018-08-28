const express = require("express");
const app = express();
const { getImagesData } = require("./queryFunctions");

app.use(express.static("./public"));
app.use(express.static("./css"));
app.listen(8080, () => console.log("Server is listening: "));

app.get("/imagesData", (req, res) => {
    getImagesData().then(data => {
        res.json(data);
    });
});
