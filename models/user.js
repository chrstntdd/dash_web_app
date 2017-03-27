var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        first_name: String,
        last_name: String
    },
    email: {type: String, required: true},
    password: String,
    location: {
        city: String,
        state: String,
        zip: String
    },
    managed_sites: [String],
    monitored_sites: [String]
})

var User = module.exports = mongoose.model('user',userSchema);

module.exports.getUser = function(id,callback){
    User.findById(id,callback);
}

module.exports.createUser = function(user,callback){
        user.save();
}
module.exports.getUsers = function(){
    User.find(callback);
}

module.exports.updateUser = function(id,update,callback){
    var query = {_id: id};
    User.findOneAndUpdate(query,update,{},callback);
}