const localize = require("../middlewares/localize");
const {
    models: { Sight: SightModel }
} = require("../database");
const Sight = require("../../models/sight");
const Wiki = require("../../wiki-api");
const wiki = new Wiki();

const convert = (sight, lang) => {
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
                sights = sights.map(sight => convert(sight, req.lang));
                return res.status(201).json(sights);
            });
    });
    router.get("/:lang?/sight/:id", localize, (req, res) => {
        SightModel.findById(req.params.id)
            .then(sight => convert(sight, req.lang))
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

    return router;
};