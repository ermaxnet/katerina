const { models: { User: UserModel, Sight: SightModel } } = require("../database");
const jsonwebtoken = require("jsonwebtoken");
const { 
    jwt, smtp,
    base_email
} = require("../../settings.json");
const passport = require("../passport");
const authorize = require("../middlewares/authorize");
const Sight = require("../../models/sight");
const nodemailer = require("nodemailer");
const KatError = require("../error");

const transporter = nodemailer.createTransport(smtp);

const releaseToken = user => {
    return jsonwebtoken.sign(
        { 
            email: user.email, name: user.name
        }, 
        jwt.secret, 
        { 
            algorithm: "HS512",
            audience: jwt.audience,
            issuer: jwt.issuer,
            expiresIn: 24 * 60 * 60
        }
    );
};

const mailTo = (email, subject, messageHTML) => {
    transporter.sendMail({
        from: base_email,
        to: email,
        subject: `KATERINA APP ${subject}`,
        html: messageHTML
    });
};

module.exports = router => {
    router.post("/auth", (req, res, next) => {
        UserModel.auth(req.body.email, req.body.password)
            .then(user => {
                if(!user) {
                    throw new KatError({ message: "Вы не опознаны", statusCode: 401 });
                }
                req.login(user, { session: false }, err => {
                    if(err) {
                        throw new KatError();
                    }
                    const token = releaseToken(user);
                    return res.status(200).json({ token });
                });
            })
            .catch(err => next(err));
    });
    router.get(
        "/all-sights", 
        passport.authenticate("jwt", { session: false }), 
        authorize([ "Moderator", "Admin" ]), 
        (req, res, next) => {
            SightModel.find()
                .then(sights => {
                    if(!sights || !sights.length) {
                        throw new KatError({ message: "Достопримечательностей не найдено", statusCode: 204 });
                    }
                    sights = sights.map(sight => new Sight(sight));
                    return res.status(200).json(sights);
                })
                .catch(err => next(err));
        }   
    );
    router.post("/sight/confirm/:id", 
        passport.authenticate("jwt", { session: false }), 
        authorize([ "Moderator", "Admin" ]), 
        (req, res, next) => {
            SightModel.update({ _id: req.params.id }, { comfirmed: true })
                .then(() => {
                    res.status(202).json({ success: true });
                    return SightModel.findById(req.params.id);
                })
                .then(sight => {
                    if(sight) {
                        const subject = `Предложенная вами достопримечательность добавлена на сайт`;
                        const messageHTML = `
                            <h1>KATERINA APP приветствует Вас!</h1>
                            <p>
                                Мы рады сообщить, что предложенная Вами достопримечательность добавлена на наш сайт.
                                Теперь все наши посетители смогут познакомится с ней. Благодарим Вас за участие!
                            </p>`;
                        mailTo(sight.email, subject, messageHTML);
                    }
                })
                .catch(err => next(err));
        }   
    );
    router.delete("/sight/reject/:id", 
        passport.authenticate("jwt", { session: false }), 
        authorize([ "Moderator", "Admin" ]), 
        (req, res, next) => {
            SightModel.findById(req.params.id)
                .then(sight => {
                    if(!sight) {
                        throw new KatError();
                    }
                    const subject = `Предложенная вами достопримечательность не прошла проверку`;
                    const messageHTML = `
                        <h1>KATERINA APP приветствует Вас!</h1>
                        <p>
                            К сожалению предложенная Вами достопримечательность не соответствует требованиям нашего сайте.
                            Мы не можем добавить ее на сайт.
                        </p>`;
                    mailTo(sight.email, subject, messageHTML);
                    return sight.remove();
                })
                .then(() => {
                    res.status(202).json({ success: true });
                })
                .catch(err => next(err));
        }   
    );
    router.delete("/sight/delete/:id", 
        passport.authenticate("jwt", { session: false }), 
        authorize([ "Moderator", "Admin"]), 
        (req, res, next) => {
            SightModel.remove({ _id: req.params.id })
                .then(() => {
                    res.status(202).json({ success: true });
                })
                .catch(err => next(err));
        }   
    );

    return router;
};