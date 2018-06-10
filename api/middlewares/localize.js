const { langs, def_lang } = require("../../settings.json");

module.exports = (req, res, next) => {
    let lang = req.params.lang || req.query.lang;
    if(!langs.includes(lang)) {
        lang = def_lang;
    }
    req.lang = lang;
    next();
};