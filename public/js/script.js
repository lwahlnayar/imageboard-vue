(function() {
    var app = new Vue({
        el: "#main",
        data: {
            imageData: null, //could this be null?
            form: {
                title: "",
                description: "",
                userName: ""
            }
        },
        mounted: function() {
            console.log("MOUNTED!");
            axios.get("/imagesData").then(function(dataRes) {
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
            }
        }
    });
})();
