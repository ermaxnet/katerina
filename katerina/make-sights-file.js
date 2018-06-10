const source = require("./source/source.json");
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
        const { link, tags, name } = source[index];
        data[name] = {
            ...sight,
            link, tags,
            comfirmed: true,
            email: "eremin.m.y@yandex.by"
        };
    });
    fs.writeFile(
        path.join(__dirname, "source", "sights.json"), 
        JSON.stringify({ sights: data }), 
        () => {
            console.log("Файл с достопримечательностями успешно записан");
        }
    );
});