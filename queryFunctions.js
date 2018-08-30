const spicedPg = require("spiced-pg");

//Makes connection from server to database
const db = spicedPg(require("./secrets.json").url);

module.exports.getImagesData = function() {
    return db
        .query(`SELECT * FROM images ORDER BY id DESC LIMIT 2;`)
        .then(results => {
            return results.rows;
        });
};

module.exports.getMoreImages = function(lastId) {
    return db
        .query(`SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 2;`, [
            lastId
        ])
        .then(results => {
            return results.rows;
        });
};

module.exports.getImageData = function(id) {
    return db
        .query(`SELECT * FROM images WHERE id = $1;`, [id])
        .then(results => {
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

module.exports.saveComments = function(image_id, username, comment) {
    return db
        .query(
            `INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *`,
            [image_id, username, comment]
        )
        .then(results => {
            return results.rows;
        });
};

module.exports.getComments = function(image_id) {
    return db
        .query(`SELECT * FROM comments WHERE image_id = $1 ORDER BY id DESC`, [
            image_id
        ])
        .then(results => {
            return results.rows;
        });
};

module.exports.lastImage = function() {
    return db
        .query(`SELECT id, title FROM images ORDER BY created_at ASC LIMIT 1;`)
        .then(results => {
            return results.rows;
        });
};
