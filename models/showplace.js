const moment = require("moment");

class Showplace {
    constructor({ id, title, text, thumbnail, link, updatedAt }) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.thumbnail = thumbnail;
        this.link = link;
        this.updatedAt = moment(updatedAt);
    }
}

module.exports = Showplace;