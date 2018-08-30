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
            exitModal: function() {
                this.imageId = null;
            },
            getImageId: function(id) {
                console.log(id);
                app.imageId = id;
            }
        } //closes all methods
    }); //closes main Vue instance

    ////////////////////////////////////COMPONENTS BELOW/////////////////////////////

    Vue.component("image-modal", {
        data: function() {
            return {
                imageData: [] //mounted function will populate this
            };
        },
        mounted: function() {
            var self = this;
            axios.get("/clickedimage/" + this.id).then(function(res) {
                console.log(res.data);
                self.imageData = res.data;
            });
        },
        methods: {
            overlayClick: function() {
                return this.$emit("clickedoutside");
            }
        },
        template: "#modalLayout",
        props: ["id"]
    });

    Vue.component("comment-component", {
        data: function() {
            return {
                commentForm: {
                    comment: "",
                    userName: "",
                    image_id: ""
                },
                commentResponse: [] //data to be populated by uploadComments
            };
        },
        mounted: function() {
            console.log("COMMENTS MOUNTED!");
            this.getComments();
        },
        methods: {
            uploadComments: function(e) {
                var self = this;
                e.preventDefault();
                this.commentForm.image_id = this.id;
                axios
                    .post("/post-comments", this.commentForm)
                    .then(function(res) {
                        console.log("COMMENT RESPONSE", res.data);
                        self.commentResponse.unshift(res.data);
                    });
            },
            getComments: function() {
                var self = this;
                axios.get("/all-image-comments/" + this.id).then(function(res) {
                    self.commentResponse = res.data;
                });
            }
        },
        template: "#commentsLayout",
        props: ["id"]
    });
})(); //closes IIFE
