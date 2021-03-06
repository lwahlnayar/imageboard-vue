(function() {
    var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
    ];
    var digitFix = function(digit) {
        var d = digit.toString();
        if (d.length == 1) {
            return "0" + d;
        } else {
            return digit;
        }
    };

    Vue.component("image-modal", {
        data: function() {
            return {
                imageData: [] //mounted function will populate this
            };
        },
        mounted: function() {
            var body = document.getElementById("body");
            body.classList.add("bodyNoOverflow");
            var header = document.getElementById("mainHeader");
            header.classList.add("mainHeaderBlurred");
            var allImages = document.getElementById("allImages");
            allImages.classList.add("allImagesBlurred");
            var moreButtonId = document.getElementById("moreButtonId");
            moreButtonId.classList.add("moreButtonBlurred");
            var footer = document.getElementById("footer");
            footer.classList.add("footerBlurred");
            var self = this;
            axios.get("/clickedimage/" + this.id).then(function(res) {
                self.imageData = res.data;
                console.log("RESPONSE OF MOUNTED", res.data);
                if (!res.data) {
                    return self.$emit("clickedoutside");
                }
            });
        },
        methods: {
            overlayClick: function() {
                return this.$emit("clickedoutside");
            },
            dateFormat: function(date) {
                var d = new Date(date);
                var dateString =
                    monthNames[d.getMonth()] +
                    " " +
                    d.getFullYear() +
                    ", " +
                    digitFix(d.getHours()) +
                    ":" +
                    digitFix(d.getMinutes());
                return dateString;
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
                        self.commentResponse.unshift(res.data);
                    });
            },
            getComments: function() {
                var self = this;
                axios.get("/all-image-comments/" + this.id).then(function(res) {
                    self.commentResponse = res.data;
                });
            },
            dateFormat: function(date) {
                var d = new Date(date);
                var dateString =
                    monthNames[d.getMonth()] +
                    " " +
                    d.getFullYear() +
                    ", " +
                    digitFix(d.getHours()) +
                    ":" +
                    digitFix(d.getMinutes());
                return dateString;
            }
        },
        template: "#commentsLayout",
        props: ["id"]
    });

    ////////////////////////////////////COMPONENTS ABOVE/////////////////////////////

    var app = new Vue({
        el: "#main",
        data: {
            imageData: null,
            form: {
                title: "",
                description: "",
                userName: ""
            },
            imageId: location.hash.length > 1 && location.hash.slice(1), //hashed
            moreButton: false
        },
        mounted: function() {
            this.getImages();
        },
        methods: {
            getImages: function() {
                console.log("1. MOUNTED!");
                axios.get("/imagesdata").then(function(dataRes) {
                    app.imageData = dataRes.data.queryData;
                    var lastImageId =
                        app.imageData[app.imageData.length - 1].id;
                    if (lastImageId != dataRes.data.lastId) {
                        app.moreButton = true;
                    }
                });
            },
            getMoreImages: function() {
                var lastImageId = this.imageData[this.imageData.length - 1].id;
                console.log("moreButton pressed! lastimgId", lastImageId);
                axios.get("/imagesdata/" + lastImageId).then(function(res) {
                    app.imageData = app.imageData.concat(res.data.queryData);
                    var lastImageId =
                        app.imageData[app.imageData.length - 1].id;
                    if (lastImageId != res.data.lastId) {
                        app.moreButton = true;
                    } else {
                        app.moreButton = false;
                    }
                });
            },
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
                    if (app.imageData.length % 5 != 0) {
                        app.imageData.pop();
                    }
                });
            }, //closes uploadImage method
            exitModal: function() {
                var body = document.getElementById("body");
                body.classList.remove("bodyNoOverflow");
                var header = document.getElementById("mainHeader");
                header.classList.remove("mainHeaderBlurred");
                var allImages = document.getElementById("allImages");
                allImages.classList.remove("allImagesBlurred");
                var moreButtonId = document.getElementById("moreButtonId");
                moreButtonId.classList.remove("moreButtonBlurred");
                var footer = document.getElementById("footer");
                footer.classList.remove("footerBlurred");
                this.imageId = null;
                location.hash = "";
            }
        } //closes all methods
    }); //closes main Vue instance
    window.addEventListener("hashchange", function(e) {
        app.imageId = location.hash.slice(1);
    });
})(); //closes IIFE
