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
        comments
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
        
        if(comments) {
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
};

module.exports = Sight;