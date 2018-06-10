module.exports = mongoose => {
    const schema = new mongoose.Schema({
        keys: {
            type: Map,
            of: {
                key1: {
                    type: String,
                    required: true
                },
                key2: {
                    type: Number
                }
            },
            required: true
        },
        names: {
            type: Map,
            of: String
        },
        coords: {
            type: {
                lat: Number,
                lon: Number
            },
            required: true
        },
        tags: [ String ],
        link: {
            type: String,
            match: /^(https?:\/\/)?(www.)?([\w\.-]+)((\/[\w\.]+)*)\/$/
        },
        rate: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        rates: [ Number ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
        comfirmed: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
            required: true,
            match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        }
    });
    return mongoose.model("Sight", schema);
};