var express = require('express');
var router = express.Router();
var Rate = require('../models/site_rate');


router.post('/new',function(req,res){
    var rates = req.body.rates;
    Rate.push_rates(rates, function(err,rates){
        if(err) throw err;
        res.send(rates);
    });
});

router.get('/:id/all',function(req,res){
    var id = req.params.id;
    Rate.get_all_rates(id,function(err,rates){
        if(err) throw err;
        res.send(rates);
    });
});

router.post('/:id/range',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    console.log("getting rates in a range");
    var results = Rate.get_rates_for_range(site,start,end);
    res.send(results);
});
router.post('/:id/range/total',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    console.log("getting total rates in a range");
    var results = Rate.get_total_rates_for_range(site,start,end);
   res.send(results);
});
router.post('/:id/range/averages',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    console.log("getting average rates in a range");
    var results = Rate.get_avgs_for_range(site,start,end);
    res.send(results);
});
module.exports = router;