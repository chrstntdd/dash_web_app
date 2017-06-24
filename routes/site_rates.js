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
    var start = moment().startOf('day');
    var end = moment().endOf('day');
console.log("getting quick stats for today from " + start + " to " + end);

    Rate.get_today_stats(site,start,end,function(err,rates){
        if (err) throw err;
        if (rates == null || rates.length == 0){ 
            console.log("No Rates"); 
            var halfHrMinutes = []
                for (i = 0; i < 30; i++){
                    halfHrMinutes.unshift(moment().subtract(i,'minutes').minutes());
                }
            var purchasesEachMinut = halfHrMinutes.map(function(moment){
                return 0;
            });
            res.send({  status:"No Rates", 
                        avg_rate:0,
                        total_visits:0,
                        total_purchases:0,
                        halfHrRate: 0,
                        halfHrVisits: 0,
                        halfHrMaxWait: 0,
                        halfHrMinWait: 0,
                        minByMinPurchase:{
                            time: halfHrMinutes,
                            wait: purchasesEachMinute
                        },
                        min:0, 
                        max:0
                
                    });
            return;
        }else{
            
//get stats for the last thirty minutes
            var startHalfHr = moment().subtract(30,'minutes');
            var endHalfHr = moment()
            var avgRateInHalfHr = 0;
            var halfHrRateCount = 0;
            var halfHrMin;
            var halfHrMax;
//map through rates and get total and average in the last half hour
            var rateObjsInHalfHr = rates.filter(function(rateObj){
                var inLastHalfHour = moment(rateObj.date).isBefore(endHalfHr) && moment(rateObj.date).isAfter(startHalfHr);
                    return inLastHalfHour;
            });
            var purchasesEachMinute = [];       //the number of new customers in line each minute 
            var purchaseDurationEachMinute = [] //the amount of time the purchase took to complete
            var timeForPurchaseEachMinute = [] //the moment in time each purchase occured
            if (rateObjsInHalfHr.length != 0){
                //get the average weight of the rates 
                    halfHrRateCount = rateObjsInHalfHr.length;
                var durationsInHalfHR = rateObjsInHalfHr.map(function(rateObj){
                    return rateObj.duration;
                });
                var durationTotal = durationsInHalfHR.reduce(function(total,rate){
                    return total + rate;
                });
                avgRateInHalfHr = durationTotal/halfHrRateCount;
                var halfHrMoments = []
                for (i = 0; i < 30; i++){
                    halfHRMoments.unshift(moment().subtract(i));
                    
                }
                
                var visitsPerMoment = halfHrMoments.map(function(moment){
                    var ratesForMoment = rateObjsInHalfHr.filter(function(obj){
                        return moment.isSame(moment(obj.date,'minute'))
                    });
                    if (ratesForMoment.length == 0){
                        purchasesEachMinute.unshift(0)
                        timeForPurchaseEachMinute.unshift(moment.minute())
                    }else{
                        ///This could be further specified by accounting for rates clocked within the same minute
                        //for those one would record the seconds property and add it as a label
                        purchasesEachMinute.unshift(ratesForMoment.length)
                        
                        for(rate in ratesForMoment){
                            purchaseDurationEachMinute.unshift(rate.duration)
                            timeForPurchaseEachMinute.unshift(moment(rate.date).minute())
                        }
                    }
                    
                });
                
                
                //Get the minimum and and maximum wait time in last half hour
            
                var sorted_rates = sortAscending(durationsInHalfHR);
                halfHrMin = sorted_rates.shift();
                sorted_rates.unshift(halfHrMin);
                halfHrMax = sorted_rates.pop();
                sorted_rates.push(halfHrMax);
       
console.log(totaledRates);
                    avg_rate_today = totaledRates/rates_in_day.length;
                
            }
            
//get the difference in days between start and end of range.
            var startDate = moment().startOf('day');
            var endDate = moment().endOf('day');
            console.log("getting quick stats for today from " + startDate + " to " + endDate);
//create a group of arrays of rates for each specific day
            var avg_rate_today = 0;
            var rateCount = 0;
            var min; 
            var max;
 //map through each array and reduce the rates to a total or average as needed
            var rateObjs_in_day = rates.filter(function(rateObject){
            var sameDay = startDate.isSame(rateObject.date,'day');
                     return sameDay;
                }).map(function(rateObj){
                    console.log(rateObj.date);
                    rateObj.date = moment(rateObj.date).utcOffset(+4,true);
                    console.log(rateObj.date);
                    return rateObj;
                });
            var rates_in_day = rateObjs_in_day.map(function(rateObject){
                    return rateObject.duration;
                });
                //total visits in a day
                rateCount = rates_in_day.length;
            var purchases = rateCount;
//multiplying all rates by negative for appropriate display in current_wait_chart...a cheap workaround to get rates to display upside down
            var all_rates = rates_in_day.map(function(rate){
                return rate*-1;
            });
//Get arry containing each hour for today
       var hours = [8,9,10,11,12,13,14,15,16,17,18,19,20];
       
       var hourMoments = hours.map(function(hr){
           return moment().hour(hr).minute(0).second(0);
        });
        console.log(hourMoments);
//Get average rate for each hour
//Map through each time in hourMoments
        var ratesEachHour = hourMoments.map(function(hr){
            if(rateObjs_in_day.length > 0){
                var hoursRates = rateObjs_in_day.map(function(rateObject){
                    return hr.isSame(rateObject.date,'hour') ? rateObject.duration : null;
                }).filter(function(duration){
                    return duration != null;
                });
                return hoursRates;
            }else{
                return [];
            }
        });
    console.log(ratesEachHour);
//with each rates duration separated by their respective hours map through each and get average by hour
        var averageEachHour = ratesEachHour.map(function(rates,index,arr){
            if(rates.length > 0){
                var totalledRates = rates.reduce(function(total,rate){
                        return total + rate;
                    });
                return totalledRates/rates.length;
            }else{
                return 0
            }
        });
        
    console.log(averageEachHour);
//Get the number of visits each hour for today
        var visitsEachHour = ratesEachHour.map(function(rates){
            return rates.length;
            }).map(function(visit){
                return visit * -1;
            });
            
     console.log(visitsEachHour);   
//Get the number of purchases hour each for today. Same as visits since we're not yet distinguishing between a purchase and a visit
        var purchasesEachHour = visitsEachHour;
        
//Get conversion rate of purchases to visits
    var conversion_rate = purchases/rateCount * 100;
    
//console.log(rates_in_day);
//Get the minimum and and maximum wait time for today
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
        res.send({
                status: "Success",
                today_rates:all_rates,
                avg_rate:avg_rate_today,
                total_visits:rateCount,
                halfHrRate: avgRateInHalfHr,
                halfHrVisits: halfHrRateCount,
                halfHrMaxWait: halfHrMax,
                halfHrMinWait: halfHrMax,
                minByMinPurchase:{
                    time: timeForPurchaseEachMinute,
                    wait: purchasesEachMinute
                },
                total_purchases: purchases, 
                min: min, 
                max: max, 
                conversion:conversion_rate,
                avgPerHr: averageEachHour,
                purchPerHr: purchasesEachHour,
                visitsPerHr: visitsEachHour
                });
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