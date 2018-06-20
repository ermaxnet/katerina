const invoke = require("../middlewares/invoke");

module.exports = router => {
    router.get("/:controller/:action?", invoke);
    router.post("/:controller/:action", invoke);
    return router;
};