const { request, mapToObj } = require("./functions");

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
        );
    }
    async _getId(key1, lang) {
        return this._send({ titles: key1 }, lang)
            .then(response => this._parse(response))
            .then(({ pageid }) => pageid);
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
                    const response = await this._send({ 
                        pageids: keys.get(lang).key2,
                        prop: "info",
                        inprop: "displaytitle"
                    }, lang);
                    const { displaytitle } = this._parse(response);
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
                let { coordinates: coords } = this._parse(response);
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
        const response = await this._send({
            pageids: key,
            prop: "extracts|pageimages|info|coordinates",
            exintro: true,
            explaintext: true,
            pithumbsize: 500,
            piprop: "thumbnail",
            inprop: "url"
        }, lang);
        const {
            extract: text,
            fullurl: wikiLink,
            touched: updatedAt,
            thumbnail: {
                source: thumbnail
            }
        } = this._parse(response);
        return {
            text, wikiLink, updatedAt, thumbnail
        };
    }
};

module.exports = Wiki;