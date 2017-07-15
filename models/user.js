var mongoose = require('mongoose');
//mongoose.connect('mongodb://heroku_d41xhhbh:8noui905v24of65nfletr5eu5s@ds129469.mlab.com:29469/heroku_d41xhhbh');
   // mongoose.connect('mongodb://localhost/pogo')

var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
    const saltrounds = 10;

var userSchema = new Schema({
    name: {
        first_name: String,
        last_name: String
    },
    facebookID: String,
    instagramID: String,
    email: {type: String, required: true},
    hash_Password: String,
    location: {
        city: String,
        state: String,
        zip: String
    },
    admin: {type: Boolean, default: false},
    managed_sites: [String],
    monitored_sites: [String]
})

var User = module.exports = mongoose.model('user',userSchema);

module.exports.getUser = function(email,callback){
    var query = {email: email};
    console.log('searching for user with email '+email)
    User.findOne(query,callback);
    // User.findOne(query,function(err,user){
    //     if(err) throw err;
    //     console.log(user.hash_Password);
    // });
}
module.exports.getUserWithID = function(id,callback){

    User.findById(id,callback);

}
module.exports.createUser = function(user,callback){
    var password = user.password;

    bcrypt.hash(user.password,saltrounds,function(err,hash){
        if (err) throw err;
        user.hash_Password = hash;
        User.create(user,callback);
    })    
}
module.exports.getUsers = function(callback){
    User.find(callback);
}

module.exports.updateUser = function(id,update,callback){
    var query = {_id: id};
    User.findOneAndUpdate(query,update,{},callback);
}