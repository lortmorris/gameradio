const http = require("http");
const express  = require("express");
const mongojs = require("mongojs");
const app = express();
const bodyParser = require('body-parser');
const config  = require("config");
const Application ={};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( express.static("./public"));


Application.db = mongojs(config.get("db").host, config.get("db").collections);
Application.libs = require("./lib")(Application);


const response = (res, err, data)=>{
    if(err) res.json({error: true, msg: err, data: null});
    else res.json({error: false, msg: "", data: data})
};

app.post("/save", (req, res, next)=>{
    let schema = {
        name: req.body.name || "noName",
        hash: req.body.hash || "noHash"
    };

    Application.db.games.insert(schema, (err, docs)=>{
        response(res, err, docs);
    });
});


app.get("/", (req, res, next)=>{
    Application.db.games.find({}, {}, (err, docs)=>{
        response(res, err, docs);
    })
});

app.get("/listen", (req, res, next)=>{
    response(res, null, []);

    Application.libs.tweeter.listen((tweet)=>{
        console.log(tweet);
    });
})

http.createServer(app)
.listen(process.env.PORT || 5000);