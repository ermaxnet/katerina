const {
    api: { ipstack: { url, key } },
    def_lang
} = require("../../settings.json");
const { request } = require("../../wiki-api/functions");

module.exports = router => {
    router.get("/geolocation/lang", (req, res) => {
        const ip = "37.44.78.50";
        request(url + ip, { access_key: key }, { protocol: "http" })
            .then(({
                country_code
            }) => {
                let lang = def_lang;
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
    });
    router.get("/geolocation/ip", (req, res) => {
        const ip = req.headers["X-Forwarded-For"]
            || req.headers["x-forwarded-for"]
            || req.client.remoteAddress;
        res.json(ip);
    });

    return router;
};