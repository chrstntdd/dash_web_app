var express = require('express');
var app = express();
var router = express.Router();

Site = require('../models/site');
Rate = require('../models/site_rate');

router.get('/',function(req,res){
    Site.getSites(function(err,sites){
        if (err) throw err;
        res.send(sites);
    })
});

router.get('/:id',function(req,res){
    Site.getSite(req.params.id,function(err,site){
        if(err) throw err;
        console.log('got a site');
        Rate.get_all_rates(id,function(err,rates){
            if(err){
                res.send({site:site});
                }else{
                    res.send({site:site,rates:rates});
            }
        });
    });
});

router.post('/new',function(req,res){
        var site = req.body;
        Site.createSite(site,function(err,site){
            if (err) throw err;
            res.send(site);
        });
});

router.post('/:id',function(req,res){
    var id = req.params.id;
    var updates = req.body.updates;
    console.log(req.body)
    console.log(req.body.updates);
    Site.updateSite(id,updates,function(err,site){
        if(err) throw err;
        res.send(site);
    });
});

router.post('/:id/manager/:man_email',function(req,res){
    var id = req.params.id;
    var man_email = req.params.man_email;
   
    Site.addManager(id,man_email,function(err,site){
        if(err) throw err;
        res.send(site);
    });
});

router.post('/:id/clear_managers',function(req,res){
    var id = req.params.id;
    Site.removeAllManagers(id,function(err,site){
        if(err) throw err;
        res.send(site);
    });
});


module.exports = router;
