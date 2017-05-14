var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var rateSchema = new Schema({
        site: String,
        rate: Number,
        date: {type: Date, default: Date.now}
})

var Rate = module.exports = mongoose.model('Rate',rateSchema)

module.exports.get_all_rates = function(site,callback){
    Rate.findById(site,callback);
}

module.exports.push_rates = function(rates,callback){
    Rate.create(rates,callback);
}