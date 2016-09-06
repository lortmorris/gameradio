var Twitter = require('twitter');
var mongojs = require('mongojs');

var client = new Twitter({
    consumer_key: 'r71V6O5gMEx9mNvajekaTcNjJ',
    consumer_secret: '3p70MBgBkAqUyo6BSgtuzDY16v52LB7qtoHY4L2qk1n8ZbSNQg',
    access_token_key: '174770913-QHvpbO1pjxIhiAlyOflosrHzHH9hxOWVu9BGys9a',
    access_token_secret: 'M7kL7ALdYp3m3AJ8mPBixdxMatUr8RwA0BVEk0YNgOxts'
});


module.exports = class {
    constructor(app) {
        this.db = app.db;
        this.track = [];
        let _this = this;
        this.ready = false;
        this.stream = null;
    }


    getKeywords() {
        let _this = this;
        return new Promise((resolve, reject)=> {
            this.db.games.find({}, {_id: 0, hash: 1}, (err, docs)=> {
                docs = docs.map( k => k.hash);
                _this.track = docs;
                _this.ready = true;
                err ? reject(err) : resolve(docs);
            });
        })
    }

    listen(cb) {
        let _this = this;

        return new Promise((resolve, reject)=> {

            _this.getKeywords()
                .then((keywords)=> {
                    console.log("Tracking: ", _this.track);
                    this.stream = client.stream('statuses/filter', {track: _this.track});
                    this.stream.on('data',  (tweet)=> {
                        _this.db.tweets.insert(tweet);
                        cb(tweet);
                    });

                    stream.on('error',  (err)=> {
                        console.log("EVT: ", err);
                        //throw err;
                    });
                })
                .catch(reject)

        })

    }//end listen
}