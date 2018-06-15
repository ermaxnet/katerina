const { request, mapToObj, parseWikiLink } = require("./functions");
const { langs: official_langs } = require("../settings.json");

class Wiki {
    constructor({ 
        endpoint = "https://lang.wikipedia.org/w/api.php", 
        userAgent = "Katerina/1.0 (Max Eremin <eremin.m.y@yandex.by>)"
    } = {}) {
        this.endpoint = endpoint;
        this.userAgent = userAgent;
    }
    _localize(lang = "en") {
        return this.endpoint.replace(/lang/i, lang);
    }
    _parse({ query }) {
        if(!query || !query.pages) {
            return {};
        }
        return Object.values(query.pages)[0];
    }
    async _send(query, lang) {
        return request(
            this._localize(lang),
            {
                action: "query",
                format: "json",
                ...query
            },
            {
                method: "GET",
                headers: {
                    "User-Agent": this.userAgent
                }
            }
        ).then(response => {
            if(response) {
                const page = this._parse(response);
                if(page) {
                    page["lang"] = lang;
                    return page;
                }
            }
            return {};
        });
    }
    async _getId(key1, lang, returnLang = false) {
        return this._send({ titles: key1 }, lang)
            .then(({ pageid, lang }) => 
                returnLang ? { pageid, lang } : pageid
            );
    }
    async getSight(keys) {
        const idsTasks = Array.from(keys.keys()).map(async lang => {
            const key2 = await this._getId(keys.get(lang).key1, lang);
            return { lang, value: key2 };
        });
        return Promise.all(idsTasks)
            .then(keys2 => {
                for (const key2 of keys2) {
                    keys.get(key2.lang).key2 = key2.value;
                }
                return keys;
            })
            .then(keys => {
                const namesTasks = Array.from(keys.keys()).map(async lang => {
                    const { displaytitle } = await this._send({ 
                        pageids: keys.get(lang).key2,
                        prop: "info",
                        inprop: "displaytitle"
                    }, lang);
                    return [ lang, displaytitle ];
                });
                return Promise.all(namesTasks);
            })
            .then(names => {
                return Promise.all(
                    [
                        this._send({
                            pageids: keys.values().next().value.key2,
                            prop: "coordinates"
                        }),
                        new Map(names)
                    ]
                );
            })
            .then(([ response, names ]) => {
                let { coordinates: coords } = response;
                if(coords) {
                    coords = {
                        lat: coords[0].lat,
                        lon: coords[0].lon
                    };
                }
                return { 
                    keys: mapToObj(keys), 
                    names: mapToObj(names),
                    coords 
                };
            });
    }
    async getSightDetail(key, lang) {
        if(typeof key === "string") {
            key = await this._getId(key, lang);
        }
        const {
            extract: text,
            fullurl: wikiLink,
            touched: updatedAt,
            thumbnail: {
                source: thumbnail
            }
        } = await this._send({
            pageids: key,
            prop: "extracts|pageimages|info",
            exintro: true,
            explaintext: true,
            pithumbsize: 500,
            piprop: "thumbnail",
            inprop: "url"
        }, lang);
        return {
            text, wikiLink, updatedAt, thumbnail
        };
    }
    async getNewSightDetail(link) {
        const [ lang, name ] = parseWikiLink(link);
        if(!name || !lang) {
            return null;
        }
        const {
            langlinks: links,
            coordinates: [ { lat, lon } ], pageid
        } = await this._send({
            titles: name,
            prop: "coordinates|langlinks",
            lllimit: 500,
            llprop: "url"
        }, lang);
        const keys = new Map(), names = new Map(), tasks = [];
        if(official_langs.includes(lang)) {
            keys.set(lang, {
                key1: name,
                key2: pageid
            });
            names.set(lang, name);
        }
        if(!links || !links.length || !(lat && lon)) {
            if(keys.size) {
                return {
                    keys, names,
                    coords: { lat, lon }
                };
            }
            return null;
        }
        const langs = links.filter(link => {
            return official_langs.includes(link.lang);
        });
        langs.forEach(link => {
            names.set(link.lang, link["*"]);
            keys.set(link.lang, { 
                key1: link["*"] 
            });
            tasks.push(this._getId(link["*"], link.lang, true));
        });
        return Promise.all(tasks)
            .then(pages => {
                pages.forEach(page => {
                    if(keys.has(page.lang)) {
                        keys.get(page.lang).key2 = page.pageid;
                    }
                });
                return {
                    keys, names,
                    coords: { lat, lon }
                };
            });
    }
};

module.exports = Wiki;