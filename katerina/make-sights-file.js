const source = require("./source.json");
const Wiki = require("../wiki-api");
const fs = require("fs");
const path = require("path");

const wikiAPI = new Wiki();

const tasks = source.map(item => {
    return wikiAPI.getBaseData(item.keys);
});

Promise.all(tasks).then(data => {
    const sights = {
        _model: "Sight"
    };
    source.forEach((item, index) => {
        const name = item.keys.en.key1;
        const dataItem = data[index];
        const keys = {};
        for (const lang in item.keys) {
            const dataKey = dataItem.keys.filter(key => key.lang === lang);
            keys[lang] = {
                "key1": item.keys[lang].key1,
                "key2": dataKey[0].key2
            };
        }
        sights[name] = {
            ...item,
            keys,
            coords: dataItem.coords
        };
    });
    const sightsJSON = JSON.stringify({ sights });
    fs.writeFile(path.join(__dirname, "..", "api", "database", "sights.json"), sightsJSON, () => {
        console.log("Файл с достопримечательностями успешно записан");
    });
});