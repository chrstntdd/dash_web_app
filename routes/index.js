var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcryptjs');
//var nodemailer = require('nodemailer');
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
        
        var page = id == "59ba6079692575148a721677" ? "test_dashboard" : "dashboard";
        console.log('page is '+page)
        if(user != null){
            
            Site.getSite(id,function(err,site){
                if(err)
                throw err;
                if(site != null){
                    console.log('site not null')
                    req.session.site = site
                    res.render(page,{
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
    var page = req.params.id == '59ba6079692575148a721677' ? 'test_transactions' : 'transactions'
    console.log(site)
    res.render(page,{site:site})
    
});
router.get('/sites/:id/purchases',function(req,res){
    var site = req.session.site
    var page = req.params.id == '59ba6079692575148a721677' ? 'test_purchases' : 'purchases'
      console.log(site)
    res.render(page,{site:site})
});
router.get('/sites/:id/visits',function(req,res){
    var site = req.session.site
    var page = req.params.id == '59ba6079692575148a721677' ? 'test_visits' : 'visits'
    res.render(page,{site:site})
});
router.get('/sites/:id/conversions',function(req,res){
    var site = req.session.site
    var page = req.params.id == '59ba6079692575148a721677' ? 'test_conversions' : 'conversions'
    res.render(page,{site:site})
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
    var content = "Name: "+name+"\nEmail: "+email+"\nMessage: "+message
    //console.log("sending email from "+email+" to blake.rogers757@gmail.com with the message "+message);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'itsdashanalytics@gmail.com',
            pass:'cckcb757'
        }
    });
    var mailOptions = {
        from: email,
        to:'itsdashanalytics@gmail.com',
        subject:'Message from Dash website visitor',
        text:content
    }
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
            res.redirect('/');
        }else{
            console.log("Email sent successfully");
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