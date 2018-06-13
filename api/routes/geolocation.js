const { def_lang } = require("../../settings.json");
const geolocation = require("../middlewares/geolocation");

module.exports = router => {
    router.get("/geolocation/lang", geolocation, (req, res) => {
        let lang = def_lang;
        const { country_code } = req.geolocation || {};
        switch(country_code) {
            case "BY":
                lang = "be";
                break;
            case "RU":
                lang = "ru";
                break;
        }
        res.json({ lang });
    });
    router.get("/geolocation/ip", (req, res) => {
        const ip = req.headers["X-Forwarded-For"]
            || req.headers["x-forwarded-for"]
            || req.client.remoteAddress;
        res.json(ip);
    });

    return router;
};