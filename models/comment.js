const moment = require("moment");

class Comment {
    constructor({
        id,
        email,
        publishAt,
        name,
        flag,
        text
    }) {
        this.id = id;
        this.email = email;
        this.publishAt = moment(publishAt);
        this.name = name;
        this.flag = flag;
        this.text = text;
    }
};

module.exports = Comment;