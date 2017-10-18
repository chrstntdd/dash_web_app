var express = require('express');
var app = express();
var router = express.Router();

Sites = require('../models/site');
Users = require('../models/user');

//do it now
router.get('/sites',function(req,res){
    var user = req.session.user;
    if (user.email == 'blake.rogers757@gmail.com'|| user.email == 'kdiedrich@gmail.com'){
            var sites = Sites.getSites(function(error,sites){
            if(sites){
                res.render('/main/admin_sites',{sites:sites});
                }else{
                    
                    res.send(error);
                }
            }
        );
    }else{
        res.send('Not Authorized');
    }
   
});

router.get('/sites/:id',function(req,res){
      var user = req.session.user;
    if (user.email == 'blake.rogers757@gmail.com'|| user.email == 'kdiedrich@gmail.com'){
        var id = req.params.id
        Sites.getSite(id,function(error,site){
            if(site){
                res.render('admin_site',{site:site})
            }
        });
    }else{
        res.send('Not Authorized');
    }
});

router.get('/users',function(req,res){
      var user = req.session.user;
    if (user.email == 'blake.rogers757@gmail.com'|| user.email == 'kdiedrich@gmail.com'){
      Users.getUsers(function(error,users){
            if(error){
                throw error
            }else{
                res.render('admin_users',{users:users})
            }
        });
    }else{
        res.send('Not Authorized');
    }
});

router.get('/users/:id',function(req,res){
      var user = req.session.user;
      console.log("fetching a user at"+ req.params.id)
      
    if (user.email == 'blake.rogers757@gmail.com' || user.email == 'kdiedrich@gmail.com'){
        var id = req.params.id
        Users.getUserWithID(id,function(err,user){
            if(err){
                throw err
            }else{
                console.log("show show page with"+ user)
                res.render('admin_user',{user:user})
            }
        });
    }else{
        res.send('Not Authorized');
    }
});

module.exports = router;