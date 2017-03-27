var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var siteSchema = new Schema({
        name: {type: String, required: true},
        location: String,
        line_lengths: [{
            length: Number,
            date: {type: Date, default: Date.now}
        }],
        device_id: String,//required to ensure proper device is updating proper site
        manager: {
            id: String,
            agent: String,
            business: String,
            email: String
        }

})

siteSchema.method.lengthWhen = function(date){
    var lengths = [];
        for (length in this.line_lengths){
                if (length.date == date){
                        lengths.push(length);
                }
        }
        return lengths;
}
siteSchema.method.lengthNow = function(){
    return this.line_lengths[0];
}
var Site = module.exports = mongoose.model('Site',siteSchema);

module.exports.getSite = function(id,callback){
    Site.findById(id,callback);
}

module.exports.createSite = function(site,callback){
        Site.create(site,callback);
}
module.exports.getSites = function(){
    Site.find(callback);
}

module.exports.updateSite = function(id,update,callback){
    var query = {_id: id};
    Site.findOneAndUpdate(query,update,{},callback);
}

