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
function sortRatesObjectsAscending(rateObjs){
    rateObjs.sort(function(rateA,rateB){
        return rateA.duration - rateB.duration;
    });
    return rateObjs;
}
function sortRatesObjectsDescending(rateObjs){
    rateObjs.sort(function(rateA,rateB){
        return rateB.duration - rateA.duration;
    });
    return rateObjs;
}
function sortDescending(values){
    values.sort(function(a,b){
        return b-a;
    });
    return values;
}

function min(collection){
    if(collection.length > 0){
    var sorted = sortDescending(collection);
    //console.log(sorted)
    return sorted.pop()
    }else{
        return 0
    }
}
function max(collection){
    if(collection.length > 0){
    var sorted = sortAscending(collection)
     //console.log(sorted)
    return sorted.pop()
    }else{
        return 0
    }
}
function avg(collection){
    if (collection.length > 0){
        var totalled = collection.reduce(function(total,value){
            return total + value;
         })
        
    return totalled/collection.length;
    }else{
        return 0;
    }
}
function total(collection){
    if (collection.length > 0){
        var totalled = collection.reduce(function(total,value){
        return total + value;
    })
    return totalled/collection.length;
    }else{
        return 0
    }
}
//***************POST A SET OF RATES FOR A SITE**********************

router.post('/new',function(req,res){
    var rates = req.body.rates;
    console.log("posting an object");
    Rate.push_rates(rates, function(err,rates){
        if(err){
            res.send("Error");
            console.log(err);
        }
        console.log("success");
        res.send(rates);
    })
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
    var start = moment().utcOffset(-4).startOf('day');//12 am this morning
    var end = moment().utcOffset(-4).endOf('day');//1159 tonight
console.log("getting quick stats for today from " + start.format() + " to " + end.format());

    Rate.get_stats(site,start,end,function(err,rates){
        if (err || rates.length == 0){ 
            res.send({status:"No Rates",error:err});
        }else{
//console.log(rates);
//get stats for the last thirty minutes
            var startHalfHr = moment().utcOffset(-4).subtract(30,'minutes');
            var endHalfHr = moment().utcOffset(-4);
//console.log(startHalfHr.format());
//console.log(endHalfHr.format());
            var allCustomersLastHalfHr = 0;//the number of people observed in last half hour
            var noVisitsLastHalfHr = 0;// the number of people observed but did not purchase in last half hour
            var noPurchasesLastHalfHr = 0; // the number of people that made a purchase in the last half hour
            var averageVisitLastHalfHr = 0;// the average duration of persons visit in last half hour 
            var averageQueueLastHalfHr = 0;// the average wait time of a customer in last half hour
            var halfHrMinWait = 0;//the minimum time recorded that a person waited in line in last half hour
            var halfHrMaxWait = 0;//the maximum time recorded that a person waited in line in last half hour
            var halfHrMinVisit = 0;//the minimum time that a person visited in last half hour 
            var halfHrMaxVisit = 0;//the maximum time that a person visited in last half hour
            var businessLastHalfHr = [];//a record of number of people in line at each minute in last half hr
            ///Get all observed customers in last half hour
            var rateObjsInHalfHr = rates.filter(function(rateObj){
                var time = moment(rateObj.date).utcOffset(-4);
                return time.isBetween(startHalfHr,endHalfHr);
            });

//console.log('rates in half hour');
//console.log(rateObjsInHalfHr);
                var halfHrMoments = []//creates an array containing each minute in last half hour. 
                for (i = 0; i < 30; ++i){
                    halfHrMoments.unshift(moment().utcOffset(-4).subtract(i,'minutes'));
                    }
            if (rateObjsInHalfHr.length != 0){
                allCustomersLastHalfHr = rateObjsInHalfHr.length;
                
                var visitsLastHalfHr = rateObjsInHalfHr.filter(function(rateObj){
                    return rateObj.transaction == false
                });
                noVisitsLastHalfHr = visitsLastHalfHr.length;
                var purchasesLastHalfHr = rateObjsInHalfHr.filter(function(rateObj){
                    return rateObj.transaction == true
                });
                noPurchasesLastHalfHr = purchasesLastHalfHr.length
                //Get average, min, and max visit times
                var allVisitDurationsLastHalfHr = visitsLastHalfHr.map(function(visit){ 
                    var rounded = Math.floor(visit.duration*100)/100
                    var perMinute = rounded/60
                    return perMinute.toFixed(2);
                });
                var totalTimeOfVisitsLastHalfHr = total(allVisitDurationsLastHalfHr);
                halfHrMaxVisit = max(allVisitDurationsLastHalfHr);
//console.log('max visits are '+ halfHrMaxVisit);
                
                halfHrMinVisit = min(allVisitDurationsLastHalfHr);
                averageVisitLastHalfHr = avg(allVisitDurationsLastHalfHr);
                //get average min and max queue times
                var allPurchaseDurationsLastHalfHr = purchasesLastHalfHr.map(function(purchase){ 
                    var rounded = Math.floor(purchase.duration*100)/100
                    var perMinute = rounded/60;
                    return perMinute.toFixed(2);
                    
                })
                var totalTimeOfAllPurhcasesLastHalfHr = total(allPurchaseDurationsLastHalfHr);
                halfHrMaxWait = max(allPurchaseDurationsLastHalfHr);
                halfHrMinWait = min(allPurchaseDurationsLastHalfHr);
                averageQueueLastHalfHr = avg(allPurchaseDurationsLastHalfHr);
                
                halfHrMoments.forEach(function(time,index){
                    var minuteEnd = time.minute() + 1;
                    var minuteTimeEnd = moment(time).add(1,'minutes');
                    console.log('searching from time '+time.format()+' to time '+minuteTimeEnd.format());
                    //mapping through each minute in the last half hour
                    ///mapping through all of the purchases in the last half hour/
                    //if that purchase was created from the start of the minute and the beginning of the  next then 
                    //it is counted towards the business activity for that minute
                    var purchasesOccuring = purchasesLastHalfHr.filter(function(purchase){
                        var purchaseEnd = moment(purchase.date).add(purchase.duration,'seconds');
                        
                        var createdBetweenMinute = moment(purchase.date).isBetween(time,minuteTimeEnd);
                        var endedBetween = purchaseEnd.isBetween(time,minuteTimeEnd);
                        var endedAfter = minuteTimeEnd.isBetween(purchase.date,purchaseEnd);
                        return createdBetweenMinute || endedBetween || endedAfter;
                    });
                    var noPurchasesOccuring = purchasesOccuring.length;
//console.log(noPurchasesOccuring+' purchases occured');
                    businessLastHalfHr.push(noPurchasesOccuring);
                })
            }
            var timeLastHalfHr = halfHrMoments.map(function(momentTime){
                return momentTime.minute;
            })
//send results 

        res.send({
                status: "Success",
                allCustomers:allCustomersLastHalfHr,
                visits:noVisitsLastHalfHr,
                purchases:noPurchasesLastHalfHr, 
                averageVisit:averageVisitLastHalfHr,
                averageWait:averageQueueLastHalfHr,
                business:businessLastHalfHr,
                timePeriod:timeLastHalfHr,
                minWait:halfHrMinWait,
                maxWait:halfHrMaxWait,
                minVisit:halfHrMinVisit, 
                maxVisit:halfHrMaxVisit,
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


//*************GET THE TOTAL NUMBER OF RATES(COUNT OF CLIENTS THAT HAVE ENTERED SITE AND MADE A PURCHASE) 
//******************************FOR A SPECIFIC SITE*********************
router.post('/:id/:range/total',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    var range = req.params.range;
console.log("getting total rates in a range from " + start +" to " + end);
    Rate.get_total_rates_for_range(site,start,end,function(err,rates){

        if (err) throw err;
        if (rates == null || rates.length == 0){ 
            console.log("No Total Rates in Range"); 
            res.send({status:"No Rates"});
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
        var clients_per_unit = [];
        var total_clients = 0;
        var min = 0;
        var max = 0;
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
                clients_per_unit.push(rates_in_day.length);
                
            });
        }else{//user is searching for info within one day. so sort for hours within 12 hour window: window length subject to change
//map through each array and reduce the rates to a total or average as needed
            for( i = 0; i < 12;i++){
                var rates_in_day = rates.filter(function(rateObject){
                     var sameDay = startDate.isSame(rateObject.date,'hour');
                     return sameDay;
                });
                clients_per_unit.push(rates_in_day.length);
            }
        }
        
    sortAscending(clients_per_unit)
    max = clients_per_unit.pop();
    clients_per_unit.push(max);
    min = clients_per_unit.shift()
    clients_per_unit.unshift(min)        
    total_clients = clients_per_unit.reduce(function(total, client){
        return total + client;
    });
//send results 
    switch (range){
        case "day":
             res.send({date:from_date,from_date: startDate,from_date: endDate, clients: clients_per_unit,total:total_clients,max:max,min:min});
        case "week":
          res.send({from_date: startDate,from_date: endDate, clients: clients_per_unit,total:total_clients,max:max,min:min});
        case "month":
            var month = startDate.month()
            res.send({from_date: startDate,from_date: endDate, clients: clients_per_unit,total:total_clients,max:max,min:min,days:days,month: month});
        default: break
    }
        
        }
        });
    
    });
   


//****************GET THE AVERAGE OF ALL RATES FOR EACH DAY WITHIN A RANGE FOR A SPECIFIC SITE********************8

router.post('/:id/:range/averages',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    var range = req.params.range
    console.log("getting average rates for site:" + site + " in a range from " + start +" to " + end);
    Rate.get_avg_rates_for_range(site,start,end,function(err,rates){
    
         if (err){
             throw err
         };
         if (rates == null || rates.length == 0){ 
             console.log("No Rates"); 
             res.send({status:"No Rates"});
             return ;
         }
          //get the difference in days between start and end of range.
        var startDate = moment(start);
//console.log(startDate);
        var endDate = moment(end);
//console.log(endDate);
        var diff = endDate.diff(startDate,'days');
//console.log(diff);
        var days = [];
        var units = [];
       

        //create a group of arrays of rates for each specific day
        var avgTimeWaitingPerUnit = [];//per min or per hour or per day averaged durations
        var avgTimeWaitingOverall = 0;//the average of all durations within time period
        var noOfPurchases = rates.length;//the amount of purchases made in the time period
        var durationsPerUnit = [];//per min or per hour or per day the amount of purchases made
        var maxWait = 0;//the maximum duration for a purchase in the entire time period
        var minWait = 0;//the shortest duration for a purchase in the entire time period
       
        if (diff > 0){
        //distinguishes whether searching for time period over multiple days or a single day
        //user is searching for info within one day. so sort for hours within 12 hour window: window length subject to change
         //create an array for each day listed
        for(i = 0; i < diff; i++){
            var day = moment(start).add(i,'days');
            days.push(day);
            units.push(day.format('Do'));
        }
                var durations = rates.map(function(rateObj){
                    return rateObj.duration
                });
                var totalledRates = total(durations);
                var rawMax = max(durations)
                    rawMax = Math.floor(rawMax*100)/100
                    maxWait = (rawMax/60).toFixed(2)
                var rawMin = min(durations)
                    rawMin = Math.floor(rawMin*100)/100
                    minWait = (rawMin/60).toFixed(2)
                var rawAvg = avg(durations);
                    rawAvg = Math.floor(rawAvg*100)/100
                avgTimeWaitingOverall = (rawAvg/60).toFixed(2);
                
                days.forEach(function(day,index){
                    var thisDayPurchases = rates.filter(function(rateObj){
                        return day.isSame(rateObj.date,'date')
                    }).map(function(purchase){
                        return purchase.duration
                    })
                    durationsPerUnit.push(thisDayPurchases.length)
                    var thisDayAvg = avg(thisDayPurchases);
                    avgTimeWaitingPerUnit.push(thisDayAvg);
                }); 
                    
                    
        }else{
        //else searching within a range less than a day. analyze by the hour
         var hrsInDay = []//creates an array containing each hour in day 
                for (i = 0; i < 12; ++i){
                    var dayHour = moment(startDate).hour(8).utcOffset(-4).add(i,'hours');
                    hrsInDay.push(dayHour);
                    units.push(dayHour.format('Ha'));
                    }
                
                var momentsOfPurchases = rates.map(function(purchase){
                    return purchase.date
                });
                //console.log(momentsOfPurchases)
                var durations= rates.map(function(rateObject){return rateObject.duration;});
                var totalledRates = total(durations);
                var rawMax = max(durations)
                    rawMax = Math.floor(rawMax*100)/100
                    maxWait = (rawMax/60).toFixed(2)
                var rawMin = min(durations)
                    rawMin = Math.floor(rawMin*100)/100
                    minWait = (rawMin/60).toFixed(2)
                var rawAvg = avg(durations);
                    rawAvg = Math.floor(rawAvg*100)/100
                avgTimeWaitingOverall = (rawAvg/60).toFixed(2);
                hrsInDay.forEach(function(hourMoment){
                    console.log(hourMoment)
                    var purchaseDurationsThisHour = rates.filter(function(purchase){
                            var purchaseEnd = moment(purchase.date).add(purchase.duration,'seconds');
                            var createdInHour = hourMoment.isSame(purchase.date,'hour');
                            var endedInHour = hourMoment.isSame(purchaseEnd,'hour');
                            return createdInHour || endedInHour;
                    }).map(function(purchases){
                        var rounded = Math.floor(100*purchases.duration)/100
                        var perMinute = rounded/60
                        return perMinute
                    });
                    console.log(purchaseDurationsThisHour)
                    var totalDurations = total(purchaseDurationsThisHour)
                    var avgDurations = avg(purchaseDurationsThisHour)
                    avgTimeWaitingPerUnit.push(avgDurations)
                });

        }
//console.log(avg_rates);
//send results
     
                res.send({  date:startDate,
                            avgWaitPerUnit: avgTimeWaitingPerUnit,
                            avgWaitOverall:avgTimeWaitingOverall,
                            purchases:noOfPurchases,
                            purchasesPerUnit:durationsPerUnit,
                            maxWait:maxWait,
                            minWait:minWait,
                            units:units
                })
                            
        
        });
    
    });
//*************GET THE TOTAL NUMBER OF RATES(COUNT OF CLIENTS THAT HAVE ENTERED SITE AND DID NOT MAKE A PURCHASE
//******************************FOR A SPECIFIC SITE*********************

router.post('/:id/:range/impressions',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    var range = req.params.range;
console.log("getting total impressions in a range from " + start +" to " + end);
    Rate.get_total_impressions_for_range(site,start,end,function(err,rates){

        if (err) throw err;
        if (rates == null || rates.length == 0){ 
            console.log("No Total Rates in Range"); 
            res.send({status:"No Rates"});
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
        var clients_per_unit = [];
        var total_clients = 0;
        var min = 0;
        var max = 0;
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
                clients_per_unit.push(rates_in_day.length);
                
            });
        }else{//user is searching for info within one day. so sort for hours within 12 hour window: window length subject to change
//map through each array and reduce the rates to a total or average as needed
            for( i = 0; i < 12;i++){
                var rates_in_day = rates.filter(function(rateObject){
                     var sameDay = startDate.isSame(rateObject.date,'hour');
                     return sameDay;
                });
                clients_per_unit.push(rates_in_day.length);
            }
        }
        
    sortAscending(clients_per_unit)
    max = clients_per_unit.pop();
    clients_per_unit.push(max);
    min = clients_per_unit.shift()
    clients_per_unit.unshift(min)        
    total_clients = clients_per_unit.reduce(function(total, client){
        return total + client;
    });
//send results 

    switch (range){
        case "day":
            var units = ['8 am','9 am','10 am','11 am','12 pm','1 pm','2 pm','3 pm'];
             res.send({date:from_date,from_date: startDate,from_date: endDate, clients: clients_per_unit,total:total_clients,max:max,min:min,units:units});
        case "week":
                  var units = days.map(function(day){
                return day.date();
            })
          res.send({from_date: startDate,from_date: endDate, clients: clients_per_unit,total:total_clients,max:max,min:min,units:days});
        case "month":
            var month = startDate.month()
           var units = days.map(function(day){
                return day.date();
            })
            res.send({from_date: startDate,from_date: endDate, clients: clients_per_unit,total:total_clients,max:max,min:min,units:units,month: month});
        default: break
    }
        
        }
        });
    
    });
router.get('/:id/:range/conversions',function(req,res){
    var site = req.params.id
    var start = req.body.start
    var end = req.body.end
    var range = req.params.range
    Rate.get_stats(site,start,end,function(err,rates){
        if (err) throw err;
        
        if(rates.length == 0){
            res.send({status:"No Rates"})
            return 
        }
        // separate all rates between customers or visitors
        var transactions = rates.filter(function(rateObj){
            return rateObj.transaction == true;
        });
        
        var visits = rates.filter(function(rateObj){
            return rateObj.transaction == false;
        });
        if (range == "day"){
            var transactionsEachHour = []
            var visitsEachHour = []
            var transactionTotalPerHour = [];
            var visitsTotalPerHour = []
            var maxDiff = 0;
            var minDiff = 0;
            var conversionRate = 0
            var startDate = moment(start);
            var endDate = moment(end);
            var diff = endDate.diff(startDate,'hours');
            var days = [startDate];
            var units = [];
            var hours = ['8 am','9 am','10 am','11 am','12 am','13 am','14 am','15 am'];
            
                if(transactions.length > 0){
                    hours.forEach(function(hour,index){
                        var hourTrans = transactions.filter(function(transObj){
                            return moment().hour(hour).isSame(transObj.date,'hour')
                        });
                        
                        transactionsEachHour.push(hourTrans)
                    });
                    
                    transactionTotalPerHour = transactionsEachHour.map(function(transactions){
                        return transactions.length;
                    });
                    
                }
                    
                if(visits.length > 0){
                     hours.forEach(function(hour,index){
                        var hourVisits = visits.filter(function(visitObj){
                            return moment().hour(hour).isSame(visitObj.date,'hour')
                        });
                        visitsEachHour.push(hourVisits)
                     });
                     
                    visitTotalsPerDay = visitsEachDay.filter(function(visits){
                        return visits.length;
                    });
                }
                var conversionDiffs = visitsTotalPerHour.map(function(visitsTotal,index){
                    return (transactionTotalPerHour[index] - visitsTotal)/(visitsTotal + transactionTotalPerHour[index])
                });
            
            sortAscending(conversionDiffs)
            maxDiff = conversionDiffs.pop()
            minDiff = conversionDiffs.shift()
            
            var percentConversionsEachHour = visitsTotalPerHour.map(function(visitTotals,index){
                return transactionTotalPerHour[index]/(visitTotals + transactionTotalPerHour[index])
            });
            
            var conversionTotal = percentConversionsEachHour.reduce(function(total,conversion){
                return  total + conversion
            });
            
            var meanConversion = conversionTotal/percentConversionsEachHour.length
            
            res.send({purchases:transactionTotalPerHour,
                    visits:visitsTotalPerHour,
                    min:minDiff,
                    max:maxDiff,
                    conv_rate:meanConversion,
                    conversions_per_hr:percentConversionsEachHour,
                    units:hours
            });
              
        }else{
            //searching within a range longer than a day
            var transactionsEachDay = [];
            var transactionTotalPerDay = [];
            var visitsEachDay = []
            var visitTotalsPerDay = []
            var maxDiff = 0;
            var minDiff = 0;
            var conversionRate = 0
            var startDate = moment(start);
            var endDate = moment(end);
            var diff = endDate.diff(startDate,'days');
            var days = [startDate];
            var units = [];
            
            //create an array for each day listed
            
            for(i = 0; i < diff; i++){
                var day = moment(start).add(i,'days');
                days.push(day);
                units.push(day.day());
            }
            if (transactions.length > 0){
                days.forEach(function(day,index){
                    var dayTrans = transactions.filter(function(transObj){
                        return moment().month(startDate.month()).date(day).isSame(transObj.date,'date');
                    });
                    transactionsEachDay.push(dayTrans);
                });
                
                transactionTotalPerDay = transactionsEachDay.map(function(transactions){
                    return transactions.length;
                });
            }
            if (visits.length > 0){
                  days.forEach(function(day,index){
                    var dayVisits = visits.filter(function(visitObj){
                        return moment().month(startDate.month()).date(day).isSame(visitObj.date,'date');
                    });
                    visitsEachDay.push(dayVisits);
                });
                visitTotalsPerDay = visitsEachDay.filter(function(visits){
                    return visits.length;
                });
            }
            var conversionDiffs = visitTotalsPerDay.map(function(visitsTotal,index){
                    return (transactionTotalPerDay[index] - visitsTotal)/(visitsTotal + transactionTotalPerDay[index])
            })
            
            sortAscending(conversionDiffs)
            maxDiff = conversionDiffs.pop()
            minDiff = conversionDiffs.shift()
            
            var percentConversionsEachDay = visitTotalsPerDay.map(function(visitTotals,index){
                return transactionTotalPerDay[index]/(visitTotals + transactionTotalPerDay[index])
            });
            
            var conversionTotal = percentConversionsEachDay.reduce(function(total,conversion){
                return  total + conversion
            });
            
            var meanConversion = conversionTotal/percentConversionsEachDay.length
            
            res.send({purchases:transactionTotalPerDay,
                    visits:visitTotalsPerDay,
                    min:minDiff,
                    max:maxDiff,
                    conv_rate:meanConversion,
                    conversions_per_day:percentConversionsEachDay,
                    units:units
                
            });
        }
        
    });
});
module.exports = router;