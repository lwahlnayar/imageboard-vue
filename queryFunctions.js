const spicedPg = require("spiced-pg");

//Makes connection from server to database
const db = spicedPg(require("./secrets.json").url);

module.exports.getImagesData = function() {
    return db.query(`SELECT * FROM images;`).then(results => {
        return results.rows;
    });
};
