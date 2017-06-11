var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcryptjs');
const saltrounds = 10;
Site = require('../models/site');
User = require('../models/user');

function json(object){
    return JSON.stringify(object);
}

// IF a user is currently logged in direct them to the management dashboard. If not render the landing page
router.get('/',function(req,res){
    if (req.session.user){
        res.render('management');
    }else{
        res.render('index');
    }
});


router.get('/sites',function(req,res){
    var user = req.session.user;
            Site.managed_sites(user.managed_sites,function(err,sites){
                if(err){
                    throw err;
                }
                if (sites.length > 0){
                    console.log(sites);
                    res.render('management',{
                        user:user,
                        sites:sites,
                        helpers: {
                            json: function(options){
                                return json(this);
                            }
                        }
                    });
                }
            });
});

router.get('/sites/:id',function(req,res){
        var user = req.session.user;
        var id = req.params.id;
        if(user != null){
            Site.getSite(id,function(err,site){
                if(err)
                throw err;
                if(site != null){
                    res.render('dashboard',{
                    user:user,
                    site:site,
                    helpers: {
                        json: function(options){
                                return json(this);
                            }
                        }    
                    });
                }
            });
        }
});

router.get('/home',function(req,res){
    res.render('index');
});

router.get('/login',function(req,res){
    res.render('login');
});

router.post('/manage',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    console.log(req.body);
    if (email && password){
     User.getUser(email,password,function(err,user){
        if (err) throw err;
        if (user){
       bcrypt.compare(password,user.hash_Password,function(err,result){
           if (result == true){
               req.session.user = user;
               res.redirect('../../sites');
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
module.exports = router;