const controllers = require("../controllers");
const KatError = require("../../api/error");

module.exports = (req, res, next) => {
    const name = req.params.controller || "home";
    let actionName = req.params.action || "index";
    actionName = `${req.method.toLowerCase()}_${actionName}`;
    if(!name || !controllers.hasOwnProperty(name)) {
        return next(new KatError({ statusCode: 404 }));
    }
    const action = controllers[name].actions[actionName];
    if(typeof action !== "function") {
        return next(new KatError({ statusCode: 404 }));
    }
    return action.apply(this, [ req, res, next ]);
};