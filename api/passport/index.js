const passport = require("passport");
const {
    Strategy: StrategyJwt,
    ExtractJwt
} = require("passport-jwt");
const { jwt } = require("../../settings.json");
const { models: { User } } = require("../database");

passport.use(new StrategyJwt(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt.secret,
        issuer: jwt.issuer,
        audience: jwt.audience
    },
    (jwt_payload, done) => {
        User.findOne({ email: jwt_payload.email })
            .populate({ path: "roles", select: "name" })
            .then(user => user ? done(null, user) : done(null, false))
            .catch(err => done(err));
    }
));

module.exports = passport;