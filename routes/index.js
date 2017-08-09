var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcryptjs');
var emailjs = require('emailjs');
const saltrounds = 10;

Site = require('../models/site');
User = require('../models/user');

function json(object){
    return JSON.stringify(object);
}

// IF a user is currently logged in direct them to the management dashboard. If not render the landing page
router.get('/',function(req,res){
    if (req.session.user){
        res.render('index',{user:req.session.user});
    }else{
        res.render('index');
    }
});

router.post('/private/api/watchdog',function(req,res){
    var site = req.body.site;
    var unit = req.body.unit;
    console.log('Unit: '+unit+' alive at site: '+site)
    res.send("Ok")
});
router.get('/sites',function(req,res){
    var user = req.session.user;
    if (user != null){
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
    }else{
        res.render('index')
    }
});

router.get('/sites/:id',function(req,res){
        var user = req.session.user;
        var id = req.params.id;
        if(user != null){
            Site.getSite(id,function(err,site){
                if(err)
                throw err;
                if(site != null){
                    req.session.site = site
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
        }else{
            res.render('index')
        }
});
router.get('/sites/:id/transactions',function(req,res){
    var site = req.session.site
    res.render('transactions',{site:site})
});
router.get('/sites/:id/purchases',function(req,res){
    var site = req.session.site
    res.render('purchases',{site:site})
});
router.get('/sites/:id/visits',function(req,res){
        var site = req.session.site
    res.render('visits',{site:site})
});
router.get('/sites/:id/conversions',function(req,res){
        var site = req.session.site
    res.render('conversions',{site:site})
});
router.get('/home',function(req,res){
    res.render('index');
});

router.get('/login',function(req,res){
    res.render('login');
});
router.get('/logout',function(req,res){
    req.session.user == null;
    req.session.site = null;
    res.render('index')
});

router.post('/mail',function(req,res){
    var email = req.body.email;
    var name = req.body.name;
    var message = req.body.message;
    console.log("sending email from "+email+" to blake.rogers757@gmail.com with the message "+message);
    message = new Email({
        to:'blake.rogers757@gmail.com',
        from : email,
        subject:"Message from Dash Web Visitor",
        body:message
    })
    message.send(function(err){
        if (err){
            console.log(err);
            res.redirect('/');
        }else{
            console.log('message from '+name+' sent sucessfully');
            res.redirect('/');
        }
    })
    
});

router.post('/manage',function(req,res){
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    console.log(req.body);
    if (email && password){
     User.getUser(email,function(err,user){
         console.log("login called back");
        if (err){
            console.log("Error logging in"+err);
            res.send("Error Logging in"+err)
        };
        if (user != null){
       bcrypt.compare(password,user.hash_Password,function(err,result){
           if (err){
               console.log(err);
               res.send("Invalid password")
           }
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