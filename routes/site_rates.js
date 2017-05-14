var express = require('express');
var router = express.Router();
Rate = require('../models/site_rate');


router.post('/new',function(req,res){
    var rates = req.body.rates;
    Rate.push_rates(rates, function(err,rates){
        if(err) throw err
        res.send(rates)
    });
});

router.get('/:id',function(req,res){
    var id = req.params.id
    Rate.get_all_rates(id,function(err,rates){
        if(err) throw err
        res.send(rates)
    });
});

module.exports = router;