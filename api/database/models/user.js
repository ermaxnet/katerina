const bcrypt = require("bcrypt-nodejs");
const SALT_WORK_FACTOR = 4;
const KatError = require("../../error");

const encryptPassword = password => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) { reject(err); }
            bcrypt.hash(password, salt, null, (err, hash) => {
                if (err) { reject(err); }
                return resolve(hash);
            });
        });
    });
};

const validatePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, isMatch) => {
            if(err) return reject(err);
            return resolve(isMatch);
        });
    });
};

module.exports = mongoose => {
    const schema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        },
        name: {
            type: String,
            required: true,
            maxlength: 25 
        },
        password: {
            type: String, 
            required: true 
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        sinceAt: Date
    });
    schema.pre("save", function(next) {
        encryptPassword(this.password)
            .then(hash => {
                this.password = hash;
                this.sinceAt = Date.now();
                next();
            })
            .catch(err => next(err));
    });
    schema.static("auth", function(email, password) {
        return this.findOne({ email })
            .exec()
            .then(user => {
                if(!user) {
                    return Promise.resolve(null);
                }
                return Promise.all([
                    validatePassword(password, user.password),
                    user
                ]);
            })
            .then(([ isMatch, user ]) => {
                return isMatch
                    ? Promise.resolve(user)
                    : Promise.reject(new KatError({ message: "Вы не опознаны", statusCode: 401 }));
            })
    });
    return mongoose.model("User", schema);
};