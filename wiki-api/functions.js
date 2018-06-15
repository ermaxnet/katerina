const https = require("https");
const http = require("http");
const url = require("url");
const querystring = require("querystring");

const request = (endpoint, query, options = {}) => {
    let { hostname, path } = url.parse(endpoint);
    query = querystring.stringify(query);
    let headers = options.headers || {};
    const method = options.method || "GET";
    if(method === "POST") {
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(query),
            ...headers
        };
    } else {
        path += "?" + query;
    }
    const protocol = options.protocol === "http" ? http : https;
    const port = options.protocol === "http" ? 80 : 443;
    delete options.protocol;
    options = {
        ...options,
        hostname, path, port,
        method,
        headers
    };
    const task = new Promise((done, error) => {
        const request = protocol.request(options, response => {
            let data = "";
            response.on("data", chunk => data += chunk);
            response.on("end", () => done(JSON.parse(data)));
        }).on("error", err => error(err));
        if(method === "POST") {
            request.write(query);
        }
        request.end();
    });
    return task;
};

const mapToObj = map => {
    const object = Object.create(null);
    for ([ key, value ] of map) {
        object[key] = value;
    }
    return object;
};

const parseWikiLink = link => {
    if(!link) {
        return [ null, null ];
    }
    const regexLang = /(?:\/\/)([a-z][a-z])(?:.)/i;
    const regexName = /(?:wiki\/)(.*)/i;
    const lang = link.match(regexLang);
    const name = link.match(regexName);
    return lang.length === 2 && name.length === 2
        ? [ lang[1], decodeURIComponent(name[1]) ]
        : [ null, null ];
};

module.exports = {
    request, mapToObj, parseWikiLink
};