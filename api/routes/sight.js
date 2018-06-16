const localize = require("../middlewares/localize");
const geolocation = require("../middlewares/geolocation");
const {
    models: { Sight: SightModel, Comment: CommentModel },
    mongoose
} = require("../database");
const Sight = require("../../models/sight");
const Comment = require("../../models/comment");
const Wiki = require("../../wiki-api");
const wiki = new Wiki();
const KatError = require("../error");

module.exports = router => {
    router.get("/:lang?/sights", localize, (req, res, next) => {
        SightModel.aggregate([
            { $match: { comfirmed: { $eq: true } } },
            { $project: {
                id: "$_id",
                key: `$keys.${req.lang}`,
                name: `$names.${req.lang}`,
                coords: 1, rate: 1, email: 1
            } }
        ]).then(sights => {
            if(!sights || !sights.length) {
                throw new KatError({ message: "Достопримечательностей не найдено", statusCode: 204 });
            }
            sights = sights.map(sight => new Sight(sight));
            return res.status(200).json(sights);
        }).catch(err => next(err));
    });
    router.get("/:lang?/sight/:id", localize, (req, res, next) => {
        SightModel.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
                { $project: {
                    id: "$_id",
                    key: `$keys.${req.lang}`,
                    name: `$names.${req.lang}`,
                    rate: 1, 
                    comments: { $size: "$comments" }
                } },
                { $limit: 1 }
            ]).then(sights => {
                if(!sights || !sights.length) {
                    throw new KatError({ statusCode: 400 });
                }
                return new Sight(sights[0]);
            }).then(sight => {
                return Promise.all([
                    wiki.getSightDetail(sight.existKey, req.lang),
                    sight
                ]);
            }).then(([ detail, sight ]) => {
                sight.addDetail(detail);
                return res.status(200).json(sight);
            }).catch(err => next(err));
    });
    router.get("/sight/:id/comments", (req, res, next) => {
        CommentModel.find({ sight: req.params.id }, "email publishAt name flag text")
            .then(comments => {
                if(!comments || !comments.length) {
                    throw new KatError({ message: "У достопримечательности нет комментариев", statusCode: 204 });
                }
                comments = comments.map(comment => new Comment(comment));
                return res.status(200).json(comments);
            }).catch(err => next(err));
    });
    router.post("/sight/:id/rate", (req, res, next) => {
        const rate = req.body.rate;
        if(rate < 0 || rate > 10) {
            return next(new KatError({ message: "Ваша оценка не может быть меньше 1 и больше 10 баллов", statusCode: 400 }));
        }
        SightModel.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
            { $addFields: {
                sum: { $sum: "$rates" },
                count: { $size: "$rates" }
            } },
            { $addFields: {
                totalSum: { $add: [ "$sum", +rate ] },
                totalCount: { $add: [ "$count", 1 ] }
            } },
            { $project: {
                rate: { $floor: { $divide: [ "$totalSum", "$totalCount" ] } }
            } }
        ]).then(sights => {
            if(!sights || !sights.length) {
                throw new KatError({ statusCode: 400 });
            }
            const new_rate = sights[0].rate;
            return Promise.all([
                new_rate,
                SightModel.update({ _id: req.params.id }, { 
                    $set: { rate: new_rate },
                    $push: { rates: rate }
                })
            ]);
        }).then(([ new_rate ]) => {
            res.status(202).json(new_rate);
        }).catch(err => next(err));
    });
    router.put("/sight/:id/comment", geolocation, (req, res, next) => {
        const comment = new Comment(req.body.comment);
        const { country_flag = null } = req.geolocation || {};
        comment.flag = country_flag;
        comment.sight = req.params.id;
        CommentModel.create(comment)
            .then(({ _id, publishAt }) => {
                comment.publishAt = publishAt;
                return SightModel.update(
                    { _id: req.params.id },
                    { $push: { comments: _id } }
                );
            })
            .then(() => res.status(201).json(comment))
            .catch(err => next(err));
    });
    router.put("/sight", (req, res, next) => {
        const { 
            link: wiki_link, 
            official_site,
            tags = [], email
        } = req.body.sight;
        wiki.getNewSightDetail(wiki_link)
            .then(sight => {
                if(!sight) {
                    throw new KatError({ message: "По вашей ссылке не найдена статья на Википедии", statusCode: 400 });
                }
                sight.email = email;
                sight.comfirmed = false;
                sight.link = official_site;
                if(!tags.length) {
                    for (const [ key, value ] of sight.names) {
                        tags.push(`#${value.replace(/\s/g, "_")}`);
                    }
                }
                sight.tags = tags;
                return SightModel.create(sight);
            })
            .then(() => res.status(201).json(true))
            .catch(err => next(err));
    });

    return router;
};