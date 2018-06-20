const VIEWS = "auth";

const index = (req, res, next) => {
    res.render(`${VIEWS}/index`, {
        title: "Katerina Admin"
    });
};

module.exports = {
    actions: {
        "get_index": index
    }
};