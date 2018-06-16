const { roles: rolesEnum } = require("../../../settings.json");

module.exports = mongoose => {
    const schema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            enum: rolesEnum
        }
    });
    return mongoose.model("Role", schema);
};