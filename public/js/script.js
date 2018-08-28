(function() {
    var app = new Vue({
        el: "#main",
        data: {
            imageData: null //could this be null?
        },
        mounted: function() {
            console.log("MOUNTED!");
            axios.get("/imagesData").then(function(dataRes) {
                console.log(dataRes.data);
                app.imageData = dataRes.data;
            });
        }
    });
})();
