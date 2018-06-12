module.exports = mongoose => {
    const schema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        },
        publishAt: {
            type: Date,
            required: true
        },
        name: String,
        flag: String,
        sight: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sight"
        },
        text: {
            type: String,
            required: true,
            maxlength: 280
        }
    });
    return mongoose.model("Comment", schema);
};