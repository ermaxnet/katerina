const { connect, disconnect } = require("../api/database");

connect(process.env)
    .then(mongoose => {
        return require("mais-mongoose-seeder")(mongoose)
            .seed(require("./source/db.json"), { 
                dropDatabase: false, dropCollections: true 
            });
        return true;
    })
    .then(() => disconnect())
    .catch(err => console.error(err));