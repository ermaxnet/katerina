const passport = require("passport");
const {
    Strategy: StrategyJwt
} = require("passport-jwt");
const { jwt } = require("../../settings.json");

const extractJwtFromCookie = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["kamin"];
    }
    return token;
};

passport.use(new StrategyJwt(
    {
        jwtFromRequest: extractJwtFromCookie,
        secretOrKey: jwt.secret,
        issuer: jwt.issuer,
        audience: jwt.audience
    },
    (jwt_payload, done) => {
        done(null, { email: jwt_payload.email });
    }
));

module.exports = passport;