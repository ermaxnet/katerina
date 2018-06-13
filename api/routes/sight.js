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
                return next(400);
            }
            sights = sights.map(sight => new Sight(sight));
            return res.status(200).json(sights);
        });
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
                    return next(400);
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
            });
    });
    router.get("/sight/:id/comments", (req, res, next) => {
        CommentModel.find({ sight: req.params.id }, "email publishAt name flag text")
            .then(comments => {
                if(!comments || !comments.length) {
                    return next(400);
                }
                comments = comments.map(comment => new Comment(comment));
                return res.status(200).json(comments);
            });
    });
    router.post("/sight/:id/rate", (req, res, next) => {
        const rate = req.body.rate;
        if(rate < 0 && rate > 10) {
            return next(400);
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
                return next(400);
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
            res.json(new_rate);
        });
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
            .then(() => {
                res.status(201).json(comment);
            });
    });
    router.put("/sight", (req, res, next) => {
        const wikiLink = req.body.link;
        res.json(wikiLink);
    });

    return router;
};