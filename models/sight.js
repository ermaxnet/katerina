const moment = require("moment");
const Comment = require("./comment");

class Sight {
    constructor({ 
        id, 
        key,
        name, 
        text, 
        thumbnail, 
        wikiLink, 
        updatedAt,
        coords,
        tags,
        link,
        rate,
        comments,
        email
    }) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.text = text;
        this.thumbnail = thumbnail;
        this.wikiLink = wikiLink;
        this.updatedAt = moment(updatedAt);
        this.coords = coords;
        this.tags = tags;
        this.link = link;
        this.rate = rate;
        this.email = email;
        
        if(comments && typeof comments === "object") {
            this.comments = 
                comments.map(comment => new Comment(comment));
        }
    }
    addDetail(detail) {
        this.thumbnail = detail.thumbnail;
        this.wikiLink = detail.wikiLink;
        this.updatedAt = moment(detail.updatedAt);
        this.text = detail.text;
    }
    get existKey() {
        return this.key.key2 || this.key.key1;
    }
};

module.exports = Sight;