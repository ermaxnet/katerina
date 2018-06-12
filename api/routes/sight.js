const localize = require("../middlewares/localize");
const {
    models: { Sight: SightModel, Comment: CommentModel },
    mongoose
} = require("../database");
const Sight = require("../../models/sight");
const Comment = require("../../models/comment");
const Wiki = require("../../wiki-api");
const wiki = new Wiki();

const sightConverter = (sight, lang) => {
    console.log(typeof sight[0].names);
    const name = sight.names.get(lang);
    const keys = sight.keys.get(lang);
    return new Sight({
        id: sight.id,
        key: keys.key2 || keys.key1,
        name,
        coords: sight.coords,
        tags: sight.tags,
        link: sight.link,
        rate: sight.rate,
        comments: sight.comments
    });
};

module.exports = router => {
    router.get("/:lang?/sights", localize, (req, res) => {
        SightModel.find()
            .then(sights => {
                if(!sights || !sights.length) {
                    return res.status(200).end();
                }
                sights = sights.map(sight => sightConverter(sight, req.lang));
                return res.status(201).json(sights);
            });
    });
    router.get("/:lang?/sight/:id", localize, (req, res) => {
        SightModel
            .aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
                { $addFields: { names: { $objectToArray: "$names" } } },
                { $addFields: { names: { $filter: {
                    input: "$names",
                    as: "name",
                    cond: { $eq: [ "$$name.k", req.lang ] }
                } } } },
                { $addFields: { keys: { $objectToArray: "$keys" } } },
                { 
                    $project: {
                        names: { $arrayToObject: "$names" },
                        keys: {
                            $filter: {
                                input: "$names",
                                as: "name",
                                cond: { $eq: [ "$$name.k", req.lang ] }
                            }
                        }
                    } 
                },
                { $limit: 1 }
            ])
            .then(sight => sightConverter(sight, req.lang))
            .then(sight => {
                return Promise.all([
                    wiki.getSightDetail(sight.key, req.lang),
                    sight
                ]);
            })
            .then(([ detail, sight ]) => {
                sight.addDetail(detail);
                return res.status(201).json(sight);
            });
    });
    router.get("/sight/:id/comments", (req, res) => {
        CommentModel.find({ sight: req.params.id })
            .then(comments => {
                return res.status(201).json(comments);
            });
    });

    return router;
};