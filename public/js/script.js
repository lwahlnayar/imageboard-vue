(function() {
    var app = new Vue({
        el: "#main",
        data: {
            imageData: null,
            form: {
                title: "",
                description: "",
                userName: ""
            },
            imageId: null
        },
        mounted: function() {
            console.log("MOUNTED!");
            axios.get("/imagesdata").then(function(dataRes) {
                console.log(dataRes.data);
                app.imageData = dataRes.data;
            });
        },
        methods: {
            uploadImage: function(e) {
                e.preventDefault();
                var file = $('input[type="file"]').get(0).files[0];
                var formData = new FormData();
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("userName", this.form.userName);
                formData.append("file", file);
                //AJAX below
                axios.post("/uploads", formData).then(function(res) {
                    console.log("RESPONSE IN POST/UPLOAD: ", res);
                    app.imageData.unshift(res.data.imageData); //RESPONSE
                });
            }, //closes uploadImage method
            getImageId: function(id) {
                console.log(id);
                app.imageId = id;
            }
        } //closes all methods
    }); //closes main Vue instance

    ////////////////////////////////////COMPONENT BELOW/////////////////////////////

    Vue.component("image-modal", {
        data: function() {
            return {
                passedImageId: null,
                imageData: []
            };
        },
        mounted: function() {
            var self = this;
            axios.get("/clickedimage/" + this.id).then(function(res) {
                console.log(res.data);
                self.imageData = res.data;
            });
        },
        template: "#modalSelector",
        props: ["id"]
    });
})(); //closes IIFE
