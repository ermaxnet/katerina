const { request } = require("./functions");
const Showplace = require("../models/showplace");

class Wiki {
    constructor({ 
        endpoint = "https://lang.wikipedia.org/w/api.php", 
        userAgent = "Katerina/1.0 (Max Eremin <eremin.m.y@yandex.by>)"
    } = {}) {
        this.endpoint = endpoint;
        this.userAgent = userAgent;
    }
    iEndpoint(lang = "en") {
        return this.endpoint.replace(/lang/i, lang);
    }
    getPage(data) {
        if(!data.query || !data.query.pages) {
            return null;
        }
        const pages = Object.values(data.query.pages);
        return pages.length ? pages[0] : null;
    }
    async getPageID(title, lang) {
        return request(
            this.iEndpoint(lang),
            {
                action: "query",
                format: "json",
                titles: title
            },
            {
                method: "GET",
                headers: {
                    "User-Agent": this.userAgent
                }
            }
        ).then(data => {
            const page = this.getPage(data);
            return page.pageid;
        });
    }
    async getShowplace(key, lang) {
        if(typeof key === "string") {
            key = await this.getPageID(key, lang);
        }
        return request(
            this.iEndpoint(lang), 
            { 
                action: "query",
                pageids: key,
                format: "json",
                prop: "extracts|pageimages|info|coordinates",
                exintro: true,
                explaintext: true,
                pithumbsize: 500,
                piprop: "thumbnail",
                inprop: "displaytitle|url"
            }, 
            {
                method: "POST",
                headers: {
                    "User-Agent": this.userAgent
                }
            }
        )
        .then(data => this.getPage(data))
        .then(page => {
            if(!page) {
                throw new Error(`Не найдены результата для запроса ${key}`);
            }
            const thumbnail = (page.thumbnail || {}).source;
            return new Showplace({
                id: page.pageid,
                title: page.displaytitle,
                text: page.extract,
                thumbnail,
                link: page.fullurl,
                updatedAt: page.touched
            });
        });
    }
    async getCoords(key, lang) {
        if(typeof key === "string") {
            key = await this.getPageID(key, lang);
        }
        return request(
            this.iEndpoint(lang), 
            { 
                action: "query",
                pageids: key,
                format: "json",
                prop: "coordinates"
            }, 
            {
                method: "POST",
                headers: {
                    "User-Agent": this.userAgent
                }
            }
        )
        .then(data => this.getPage(data))
        .then(page => {
            if(!page) {
                throw new Error(`Не найдены результата для запроса ${key}`);
            }
            let coords = page.coordinates || null;
            if(coords && coords.length) {
                coords = {
                    lat: coords[0].lat,
                    lon: coords[0].lon
                };
            }
            return coords;
        });
    }
    async getBaseData(keys) {
        const tasks = Object.keys(keys).map(async (lang) => {
            const key2 = await this.getPageID(keys[lang].key1, lang);
            return { lang, key2 };
        });
        return Promise.all(tasks)
            .then(keys => {
                return Promise.all([
                    this.getCoords(keys[0].key2, keys[0].lang),
                    Promise.resolve(keys)
                ]);
            })
            .then(([ coords, keys ]) => {
                return { keys, coords };
            });
    }
};

module.exports = Wiki;