const VIEWS = "cabinet";

const index = (req, res, next) => {
    res.render(`${VIEWS}/sights`, {
        title: "Cabinet | Katerina Admin"
    });
};

module.exports = {
    actions: {
        "get_index": index,
        "post_index": index
    }
};