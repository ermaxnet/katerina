module.exports = mongoose => {
    const schema = new mongoose.Schema({
        keys: {
            type: Map,
            of: {
                key1: {
                    type: String
                },
                key2: {
                    type: Number
                }
            }
        },
        coords: {
            lat: Number,
            lon: Number
        },
        tags: {
            type: [ String ]
        },
        link: {
            type: String,
            default: null
        }
    });
    return mongoose.model("Sight", schema);
};