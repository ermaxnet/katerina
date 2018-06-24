const invoke = require("../middlewares/invoke");
const passport = require("../passport");

module.exports = router => {
    router.get("/:controller?/:action?", invoke);
    router.post("/:controller/:action", invoke);
    
    router.get("/cabinet/:controller/:action", passport.authenticate("jwt", { 
        session: false,
        failureRedirect: "/admin/home/index",
        failureFlash: false
    }), invoke);
    router.post("/cabinet/:controller/:action", passport.authenticate("jwt", { 
        session: false,
        failureRedirect: "/admin/home/index",
        failureFlash: false
    }), invoke);

    return router;
};