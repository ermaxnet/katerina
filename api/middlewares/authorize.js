const KatError = require("../error");

module.exports = roles => {
    return (req, res, next) => {
        if(!req.user || !req.user.roles) {
            next(new KatError({ message: "Вы не опознаны", statusCode: 401 }));
        }
        for (const { name } of req.user.roles) {
            if(roles.includes(name)) {
                next();
            }
        }
        next(new KatError({ message: "У вас нет прав на данную операцию", statusCode: 403 }));
    };
}