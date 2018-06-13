const {
    api: { ipstack: { url, key } }
} = require("../../settings.json");
const { request } = require("../../wiki-api/functions");

module.exports = (req, res, next) => {
    /* const ip = req.headers["X-Forwarded-For"]
        || req.headers["x-forwarded-for"]
        || req.client.remoteAddress; */
    const ip = "37.44.78.50";
    request(url + ip, { access_key: key }, { protocol: "http" })
        .then(({
            country_code,
            country_name,
            location: { country_flag }
        }) => {
            req.geolocation = { country_code, country_name, country_flag };
            next();
        });
};