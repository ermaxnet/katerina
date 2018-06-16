const source = require("./source/sights.json");
const Wiki = require("../wiki-api");
const fs = require("fs");
const path = require("path");

const wikiAPI = new Wiki();

const tasks = source.map(item => {
    item.keys = new Map(item.keys);
    return wikiAPI.getSight(item.keys);
});

Promise.all(tasks).then(sights => {
    const data = {
        _model: "Sight"
    };
    sights.forEach((sight, index) => {
        const { link, tags, name, _id, comments = [] } = source[index];
        data[name] = {
            ...sight,
            link, tags,
            comfirmed: true,
            email: "eremin.m.y@yandex.by",
            _id, comments
        };
    });
    fs.writeFile(
        path.join(__dirname, "source", "db.json"), 
        JSON.stringify({ 
            comments: require("./source/comments.json"), 
            sights: data, 
            roles: require("./source/roles.json"),
            users: require("./source/users.json")
        }), 
        () => {
            console.log("Файл с достопримечательностями успешно записан");
        }
    );
});