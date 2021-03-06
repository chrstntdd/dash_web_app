var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcryptjs');
    const saltrounds = 10;
User = require('../models/user');


router.post('/login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    console.log(req.body);
    if (email && password){
     User.getUser(email,function(err,user){
        if (err) throw err;
        if (user){
       bcrypt.compare(password,user.hash_Password,function(err,result){
           if (result == true){
               var signee = {
                   _id: user._id,
                   name: user.name,
                   email: user.email,
                   managed_sites: user.managed_sites
               }
               res.send(signee);
           }else{
               res.send("Unauthorized Login")
           }
       });
     }else{
         res.send("Unauthorized Login");
     }
    });
    }else{
        res.send("Invalid Info");
    }
   
});


router.post('/create',function(req,res){
        var user = req.body;
        User.createUser(user,function(err,user){
            if (err) throw err;
            res.send(user);
        });
});

router.put('/:id',function(req,res){
    var id = req.params.id;
    var updates = req.body.updates;
   User.updateUser(id,updates,function(err,user){
         if (err) throw err;
            res.send(user);
   });
});

module.exports = router;
