const { 
    connect, 
    disconnect, 
    models: { Sight } 
} = require("./database");

connect({ NODE_ENV: "test" })
    .then(() => {
        console.log("done");
        return Sight.find();
    })
    .then(sights => {
        sights.forEach(element => {
            console.log(element);
        });
        return disconnect();
    })
    .then(() => {
        console.log("end");
     })
    .catch(err => console.error(err));