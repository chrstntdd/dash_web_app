var express = require('express');
var app = express();
var router = express.Router();

Sites = require('../models/site');
Users = require('../models/user');


router.get('/sites',function(req,res){
    var sites = Sites.getSites(function(error,sites){
        if(sites){
            res.render('sites_admin',{sites:sites});
            }else{
                res.send(error);
            }
        }
    );
});

router.get('/sites/:id',function(req,res){
    var id = req.params.id
    Sites.getSite(id,function(error,site){
        if(site){
            res.render('site_admin',{site:site})
        }
    });
});

router.get('/users',function(req,res){
  Users.getUsers(function(error,users){
        if(error){
            throw error
        }else{
            res.render('users_admin',{users:users})
        }
    });
});

router.get('/users/:id',function(req,res){
    var id = req.params.id
    
    Users.getUserWithID(id,function(err,user){
        if(err){
            throw err
        }else{
            res.render('user_admin',user)
        }
    });
});

module.exports = router;