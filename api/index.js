const express = require("express");
const bodyParser = require("body-parser");
const { connect } = require("./database");

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 40);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router({ mergeParams: true });
app.use("/api", require("./routes/geolocation")(router));
app.use("/api", require("./routes/sight")(router));

app.use((req, res, next) => {
    console.log(404);
    res.end();
});
app.use((err, req, res, next) => {
    console.error(err);
    res.end();
});

connect(process.env).then(() => {
    app.listen(app.get("port"), () => {
        console.log(`Katerina API listen on port ${app.get("port")}`);
    });
});