

const Tweeter  =require("./tweeter");

module.exports = (app)=>{

    return {
        tweeter:  new Tweeter(app)
    }
}

