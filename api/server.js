const { connect } = require("./database");
const app = require("./index");

connect(process.env).then(() => {
    app.listen(app.get("port"), () => {
        console.log(`Katerina API listen on port ${app.get("port")}`);
    });
});