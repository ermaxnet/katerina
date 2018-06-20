const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const path = require("path");

const app = express();
app.set("port", process.env.PORT || 7776);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("json spaces", 40);

app.use(serveStatic(path.join(__dirname, "assets")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router({ mergeParams: true });
app.use("/", require("./routes")(router));

app.listen(app.get("port"), () => {
    console.log(`Katerina API listen on port ${app.get("port")}`);
});