const VIEWS = "home";
const { request } = require("../../wiki-api/functions");

const index = (req, res, next) => {
    if(req.cookies && req.cookies["kamin"]) {
        return res.redirect(307, "/admin/cabinet/sights/index");
    }
    res.render(`${VIEWS}/index`, {
        title: "Katerina Admin",
        name: "katerina"
    });
};

const auth = (req, res, next) => {
    request("http://localhost:3000/api/admin/auth", req.body, {
        method: "POST",
        protocol: "http",
        port: 3000
    }).then(response => {
        if(response.token) {
            return res.cookie("kamin", response.token, { 
                expires: new Date(Date.now() + 900000) 
            }).redirect(307, "/admin/cabinet/sights/index");
        }
        res.render(`${VIEWS}/index`, {
            title: "Katerina Admin",
            name: "katerina",
            error: response.err
        });
    });
};

module.exports = {
    actions: {
        "get_index": index,
        "post_auth": auth
    }
};