const mongoose = require("mongoose");
const Sight = require("./models/sight")(mongoose);

module.exports = {
    connect(env) {
        const namespace = env.NODE_ENV === "test" ? "courses-test" : "courses";
        return mongoose.connect(`mongodb://localhost:27017/${namespace}`, { autoIndex: false })
            .then(() => {
                return env.NODE_ENV === "production"
                    ? Promise.resolve()
                    : require("mais-mongoose-seeder")(mongoose)
                        .seed(require("./sights.json"), { 
                            dropDatabase: false, dropCollections: true 
                        });
            });
    },
    disconnect() {
        return mongoose.connection.close();
    },
    models: { Sight }
};