const mongoose = require("mongoose");
const Sight = require("./models/sight")(mongoose);
const Comment = require("./models/comment")(mongoose);
const Role = require("./models/role")(mongoose);
const User = require("./models/user")(mongoose);

module.exports = {
    async connect(env) {
        const namespace = env.NODE_ENV === "test" ? "katerina-test" : "katerina";
        return mongoose.connect(`mongodb://localhost:27017/${namespace}`)
            .then(() => mongoose);
    },
    async disconnect() {
        return mongoose.connection.close();
    },
    models: { Sight, Comment, Role, User }, mongoose
};