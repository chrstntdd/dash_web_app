var mongoose = require('mongoose');

//mongoose.connect('mongodb://heroku_d41xhhbh:8noui905v24of65nfletr5eu5s@ds129469.mlab.com:29469/heroku_d41xhhbh');
   // mongoose.connect('mongodb://localhost/pogo')
var Schema = mongoose.Schema;

var siteSchema = new Schema({
        name: {type: String, required: true},
        location: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        line_rates: [{
            rate: Number,
            date: {type: Date, default: Date.now}
        }],
        device_id: String,//required to ensure proper device is updating proper site
        manager: {
            id: String,
            agent: String,
            business: String,
            email: String
        },
        hours:{
            monday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            },
             tuesday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            }, wednesday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            }, thursday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            }, friday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            }, saturday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            }, sunday:{
                open:{time: String,period:String},
                close:{time: String,period: String}
            },
        }
});



siteSchema.statics.rateToday = function(){
    function thisMonthRates(rate){
        thisMonth = Date.getMonth();
        return rate.getMonth() == thisMonth
    }
    monthRates =  this.line_rates.filter(thisMonthRates);
    function rateValue(rate){
        return rate.rate;
    }
    function sumRates(total,rate){
            return total + rate;
    }
    totalOfRates = monthRates.map(rateValue).reduce(sumRates);
    numberOfRates = monthRates.count;

   return 2
}

var Site = module.exports = mongoose.model('Site',siteSchema);


module.exports.getSite = function(id,callback){
    Site.findById(id,callback);
}
module.exports.monitoredSites = function(ids,callback){
    var query = {_id:ids};
    Site.find(query,callback);
    
}
module.exports.createSite = function(site,callback){
        Site.create(site,callback);
}
module.exports.getSites = function(callback){
    Site.find(callback);
}
module.exports.updateRate = function(id,rate,callback){
    var newRate = {
        rate: rate
    }
    Site.findById(id,function(err,site){
        if (err) throw err;
        site.line_rates.push(newRate);
        site.save(callback)
    })
}
module.exports.updateSite = function(id,update,callback){
    var query = {_id: id};
    Site.findOneAndUpdate(query,update,{},callback);
}

