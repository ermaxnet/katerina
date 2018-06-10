const https = require("https");
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
    options = {
        ...options,
        hostname, path, port: 443,
        method,
        headers
    };
    const task = new Promise((done, error) => {
        const request = https.request(options, response => {
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

module.exports = {
    request, mapToObj
};