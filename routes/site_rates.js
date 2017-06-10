var express = require('express');
var router = express.Router();
var Rate = require('../models/site_rate');
var moment = require('moment');

function sortAscending(values){
    values.sort(function(a,b){
        return a-b;
    });
    return values;
}

function sortDescending(values){
    values.sort(function(a,b){
        return b-a;
    });
    return values;
}


//***************POST A SET OF RATES FOR A SITE**********************

router.post('/new',function(req,res){
    var rates = req.body.rates;
    Rate.push_rates(rates, function(err,rates){
        if(err) throw err;
        res.send(rates);
    });
});


//***********GET ALL OF THE RATES FOR A PARTICULAR SITE ****************


router.get('/:id/all',function(req,res){
    var id = req.params.id;
    Rate.get_all_rates(id,function(err,rates){
        if(err) throw err;
        res.send(rates);
    });
});


//*********GET QUICK STATS FOR TODAY****************


router.get('/:id/today',function(req,res){
    var site = req.params.id;
    var start = moment.utc().startOf('day');
    var end = moment.utc().endOf('day');
console.log("getting quick stats for today");
    Rate.get_today_stats(site,start,end,function(err,rates){
        if (err) throw err;
        if (rates == null || rates.length == 0){ 
            console.log("No Rates"); 
            res.send("No Rates");
            return;
        }else{

//get the difference in days between start and end of range.
            var startDate = moment().startOf('day');
            var endDate = moment().endOf('day');
//create a group of arrays of rates for each specific day
            var avg_rate_today = 0;
            var rateCount = 0;
            var min; 
            var max;
 //map through each array and reduce the rates to a total or average as needed
            var rates_in_day = rates.filter(function(rateObject){
            var sameDay = startDate.isSame(rateObject.date,'day');
                     return sameDay;
                }).map(function(rateObject){
                    return rateObject.duration;
                });
                rateCount = rates_in_day.length;
                
console.log(rates_in_day);
            if (rates_in_day.length > 0){
                var sorted_rates = sortAscending(rates_in_day);
                min = sorted_rates.shift();
                sorted_rates.unshift(min);
                max = sorted_rates.pop();
                sorted_rates.push(max);
                var totaledRates = rates_in_day.reduce(function(total,duration){
                    return total + duration;
                    });
console.log(totaledRates);
                    avg_rate_today = totaledRates/rates_in_day.length;
                }
//console.log(avg_rate_today);
//send results 
        res.send({avg_rate:avg_rate_today,total:rateCount,min: min, max: max});
        }
        });
    });
    

//***********GET A RAW SET OF RATES FOR A SPECIFIC SITE***********************



router.post('/:id/range',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
//console.log("getting rates in a range");
    var results = Rate.get_rates_for_range(site,start,end);
    res.send(results);
});


//*************GET THE TOTAL NUMBER OF RATES(COUNT OF CLIENTS THAT HAVE ENTERED SITE) 
//******************************FOR A SPECIFIC SITE*********************


router.post('/:id/range/total',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    
console.log("getting total rates in a range from " + start +" to " + end);
    Rate.get_total_rates_for_range(site,start,end,function(err,rates){

        if (err) throw err;
        if (rates == null || rates.length == 0){ 
            console.log("No Total Rates in Range"); 
            res.send("No Rates");
            return ;
        }else{
        
          //get the difference in days between start and end of range.
        var startDate = moment(start);
        var endDate = moment(end);
//console.log(startDate);
//console.log(endDate);
        var diff = endDate.diff(startDate,'days');
//console.log(diff);
        var days = [];
//create a group of arrays of rates for each specific day
        var clients_per_day = [0];
        var total_clients = 0;
//create an array for each day listed
        for(i = 0; i < diff; i++){
            var day = moment(start).add(i,'days');
            days.push(day);
        }
//console.log(days);
        if (diff > 0){
                days.forEach(function(day,index){
             //map through each array and reduce the rates to a total or average as needed
                var rates_in_day = rates.filter(function(rateObject){
//console.log(day);
//console.log(rateObject.date);
                   var sameDay = day.isSame(rateObject.date,'day');
                   return sameDay;
                });
                clients_per_day.push(rates_in_day.length);
                
            });
        }else{
            //map through each array and reduce the rates to a total or average as needed
                var rates_in_day = rates.filter(function(rateObject){
                     var sameDay = startDate.isSame(rateObject.date,'day');
                     return sameDay;
                });
                
                clients_per_day.push(rates_in_day.length);
    
        }
    total_clients = clients_per_day.reduce(function(total, client){
        return total + client;
    });
//send results 
        res.send({start: startDate, end: endDate, clientsPerDay: clients_per_day,total:total_clients, days:days});
        }
        });
    
    });
   


//****************GET THE AVERAGE OF ALL RATES FOR EACH DAY WITHIN A RANGE FOR A SPECIFIC SITE********************8



router.post('/:id/range/averages',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    console.log("getting average rates in a range from " + start +" to " + end);
    Rate.get_avg_rates_for_range(site,start,end,function(err,rates){
         if (err) throw err;
         if (rates == null || rates.length == 0){ 
             console.log("No Rates"); 
             res.send("No Rates");
             return ;
         }
          //get the difference in days between start and end of range.
        var startDate = moment(start);
//console.log(startDate);
        
        var endDate = moment(end);
//console.log(endDate);
        var diff = endDate.diff(startDate,'days');
//console.log(diff);
        var days = [startDate];
        var labels = [];
        //create an array for each day listed
        for(i = 0; i < diff; i++){
            var day = moment(start).add(i,'days');
            days.push(day);
            labels.push(day.day());
        }
//console.log(days);
        //create a group of arrays of rates for each specific day
        var avg_rates = [];
        var rateCount = 0;
        if (diff > 0){
                days.forEach(function(day,index){
    //map through each array and reduce the rates to a total or average as needed
                var rates_in_day = rates.filter(function(rateObject){
                    var sameDay = day.isSame(rateObject.date,'day');
                        return sameDay;
                }).map(function(rateObject){
                    return rateObject.duration;
                });
                if (rates_in_day.length > 0){
                    var totalled_rates = rates_in_day.reduce(function(total,duration){
                        return total + duration;
                    });
                    var avg = totalled_rates/rates_in_day.length
                        avg_rates.push(avg);
                    }else{
                        avg_rates.push(0);
                    }
                });
            
            
        }else{
            //map through each array and reduce the rates to a total or average as needed
                var rates_in_day = rates.filter(function(rateObject){
                     var sameDay = startDate.isSame(rateObject.date,'day');
                     return sameDay;
                }).map(function(rateObject){
                    return rateObject.duration;
                });
                rateCount = rates_in_day.length;
console.log(rates_in_day);
                if (rates_in_day.length > 0){
                    var totalledRates = rates_in_day.reduce(function(total,duration){
                        return total + duration;
                    });
console.log(totalledRates);
                    avg_rates.push(totalledRates/rates_in_day.length);
                }else{
                    avg_rates.push(0);
                }
        }
//console.log(avg_rates);
//send results 
        res.send({start: startDate, end: endDate, avg_rates:avg_rates,total:rateCount, days:labels});
        });
    
    });
    
module.exports = router;