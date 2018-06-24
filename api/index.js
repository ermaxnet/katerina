const express = require("express");
const bodyParser = require("body-parser");
const passport = require("./passport");
const KatError = require("./error");
const cors = require("cors");

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 40);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const router = express.Router({ mergeParams: true });
app.use("/api", require("./routes/geolocation")(router));
app.use("/api", require("./routes/sight")(router));

app.use(passport.initialize());
app.use("/api/admin", require("./routes/admin")(router));

app.use((req, res, next) => {
    next(new KatError({ statusCode: 404 }));
});
app.use((err, req, res, next) => {
    if(err instanceof KatError) {
        res.status(err.statusCode);
    } else {
        res.status(500);
    }
    return res.json({ err: err.message, code: err.code || -100 });
});

module.exports = app;