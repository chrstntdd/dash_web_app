var express = require('express');
var app = express();
var router = express.Router();

Site = require('../models/site');
router.get('/',function(req,res){
    res.send('Site Page');
});

router.get('/:id',function(req,res){
    Site.getSite(req.params.id,function(err,site){
        if(err) throw err;
        res.send(site);
    });
});

router.post('/',function(req,res){
        var site = req.body;
        Site.createSite(site,function(err,site){
            if (err) throw err;
            res.send(site);
        });
})
router.put('/:id/length',function(req,res){
    var id = req.params.id;
    var updates = req.body.updates;
    Site.updateSite(id,updates,function(err,site){
        if(err) throw err;
        res.send(site);
    });
});
router.put('/:id',function(req,res){
    var id = req.params.id;
    var updates = req.body.updates;
    Site.updateSite(id,updates,function(err,site){
        if(err) throw err;
        res.send(site);
    });
});
module.exports = router;
