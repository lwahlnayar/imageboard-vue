const spicedPg = require("spiced-pg");

//Makes connection from server to database
const db = spicedPg(require("./secrets.json").url);

module.exports.getImagesData = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC;`).then(results => {
        return results.rows;
    });
};

module.exports.saveOnlineImages = function(url, username, title, description) {
    return db
        .query(
            `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [url, username, title, description]
        )
        .then(results => {
            return results.rows;
        });
};
