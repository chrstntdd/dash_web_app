var express = require('express');
var router = express.Router();
var Rate = require('../models/site_rate');
var moment = require('moment');

function sortAscending(values){
    var sorted = values.sort(function(a,b){
        return a-b;
    });
    return sorted;
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
    var sorted = values.sort(function(a,b){
        return b-a;
    });
    return sorted;
}
function min_not_zero(collection){
    if(collection.length > 0){
        var toSort = [];
            toSort = toSort.concat(collection)
        var sorted = sortDescending(toSort);
        ////console.log(sorted)
        var last = sorted.pop()
        if (last > 0 ){
            return last;
        }else{
          min_not_zero(sorted)  
        }
    }else{
        return 0
    }
}
function min(collection){
    if(collection.length > 0){
        var toSort = [];
            toSort = toSort.concat(collection)
        var sorted = sortDescending(toSort);
        ////console.log(sorted)
        return sorted.pop()
    }else{
        return 0
    }
}
function max(collection){
    if(collection.length > 0){
    var toSort = [];
        toSort = toSort.concat(collection)
    var sorted = sortAscending(toSort)
     ////console.log(sorted)
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
function weedNaN(number){
	return number.toString() == "NaN" ? 0 : number 
}
//***************POST A SET OF RATES FOR A SITE**********************

router.post('/new',function(req,res){
    var rates = req.body.rates;
    //console.log("posting an object");
    console.log(moment().hour);
    var site = req.body.rates[0].site;
    Site.getSite(site,function(err,location){
        if(err){
            res.send("error getting site");
        }else{
            var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
            var weekdayInt= moment().utcOffset('+0400').day();
            
            var today = days[weekdayInt];
            var schedule;
            switch(today){
                case "sunday":
                    schedule = location.schedule.sunday;
                    break;
                case "monday":
                      schedule = location.schedule.monday;
                    break;
                case "tuesday":
                      schedule = location.schedule.tuesday;
                    break;
                case "wednesday":
                      schedule = location.schedule.wednesday;
                    break;
                case "thursday":
                      schedule = location.schedule.thursday;
                    break;
                case "friday":
                      schedule = location.schedule.friday;
                    break;
                case "saturday":
                      schedule = location.schedule.saturday;
                    break;
                default: break
            }
            console.log("today is "+today);
            
            console.log(schedule)
            var thisHour = moment().hour();
                thisHour -= 4;
            if(schedule.operating && thisHour >= schedule.open && thisHour < schedule.close){
                 var device_ids = location.device_ids;
                Rate.push_rates(device_ids,rates, function(err,rates){
                    if(err){
                        res.send("Error");
                        //console.log(err);
                    }
                    //console.log("success");
                    res.send(rates);
                })
            }else if(thisHour >= 1 && thisHour < 3){//run this script to check for site devices between 1am and 3am
                //get the rate ids of the collected rates and store them as device ids for this day.
                //once the store is open the rates posted will be checked against the device id list before updating
                var ids = rates.map(function(rate){
                    return rate.customer_id;
                })
                console.log("ids are "+ids);
             
                var device_ids = location.device_ids;
                    if (device_ids.length > 0){
                        ids.forEach(function(id){
                            if(device_ids.some(function(device_id){return device_id == id })){
                                console.log('id '+id+' is already saved')
                            }else{
                                device_ids.push(id)
                            }
                        })
                      Site.update_site_devices(site,device_ids)
                       
                       res.send("updated devices")
                    }else{
                      
                        Site.update_site_devices(site,ids)
                       
                       res.send("updated devices")
                      
                    }
                    
                
             
            }else{
                //site is closed no more rates can be posted
                res.send("New Rates no longer allowed for today")
                console.log("new rates prevented for hour "+thisHour)
            }
        }
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
    //console.log("getting quick stats for today from " + start.format() + " to " + end.format());

    Rate.get_stats(site,start,end,function(err,rates){
        if (err || rates.length == 0){ 
            res.send({status:"No Rates",error:err});
        }else{
////console.log(rates);
//get stats for the last thirty minutes
            var startHalfHr = moment().utcOffset(-4).subtract(30,'minutes');
            var endHalfHr = moment().utcOffset(-4);
////console.log(startHalfHr.format());
////console.log(endHalfHr.format());
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

////console.log('rates in half hour');
////console.log(rateObjsInHalfHr);
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
////console.log('max visits are '+ halfHrMaxVisit);
                
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
                    //console.log('searching from time '+time.format()+' to time '+minuteTimeEnd.format());
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
////console.log(noPurchasesOccuring+' purchases occured');
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
////console.log("getting rates in a range");
    var results = Rate.get_rates_for_range(site,start,end);
    res.send(results);
});


//*************GET THE TOTAL NUMBER OF RATES(COUNT OF CLIENTS THAT HAVE ENTERED SITE AND MADE A PURCHASE) 
//******************************FOR A SPECIFIC SITE*********************
router.post('/:id/:range/total',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    var range = req.params.range
    //console.log("getting total rates for site:" + site + " in a range from " + start +" to " + end);
    Rate.get_total_rates_for_range(site,start,end,function(err,rates){
    
         if (err){
             throw err
         };
         if (rates.length == 0){ 
             //console.log("No Rates"); 
             res.send({status:"No Rates"});
             return ;
         }
          //get the difference in days between start and end of range.
        var startDate = moment(start);
////console.log(startDate);
        var endDate = moment(end);
////console.log(endDate);
        var diff = endDate.diff(startDate,'days');
////console.log(diff);
        var days = [];
        var units = [];
        //create a group of arrays of rates for each specific day
        var avgPurchases = 0;//the average fo purchases made over period
        var purchasesPerUnit = [];//per min or per hour or per day averaged purchase
        var noOfPurchases = 0;//the amount of purchases made in the time period
        var maxPurchases = 0;//the maximum duration for a purchase in the entire time period
        var minPurchases = 0;//the shortest duration for a purchase in the entire time period
        ////console.log("rates are "+ rates)
        var purchases = rates.filter(function(rateObj){
                    return rateObj.transaction == true;
            });
        ////console.log("purchases are "+purchases)
            noOfPurchases = purchases.length;
            
        if (diff > 0){
        //distinguishes whether searching for time period over multiple days or a single day
        //user is searching for info within one day. so sort for hours within 12 hour window: window length subject to change
         //create an array for each day listed
            for(i = 0; i < diff; i++){
                var day = moment(start).add(i,'days');
                days.push(day);
                units.push(day.format('Do'));
            }
            var daysOfPurchases = purchases.map(function(purchase){
                    return moment(purchase.date).utcOffset(-4);
                });
                //console.log(daysOfPurchases);
            days.forEach(function(day,index){
                var thisDayPurchases = daysOfPurchases.filter(function(purchaseDay){
                    return day.date() == moment(purchaseDay).date()
                });
               
                purchasesPerUnit.push(thisDayPurchases.length);
            }); 
        }else{
        //else searching within a range less than a day. analyze by the hour
         var hrsInDay = []//creates an array containing each hour in day 
                for (i = 0; i < 10; ++i){
                    var dayHour = moment(startDate).hours(8).minutes(0).seconds(0).add(i,'hours');
                        hrsInDay.push(dayHour);
                        units.push(dayHour.format('ha'));
                    }
                ////console.log(hrsInDay);
                var hoursOfPurchases = purchases.map(function(purchase){
                    return moment(purchase.date).utcOffset(-4);
                });
                //console.log(hoursOfPurchases);
                //console.log(hrsInDay);
                hrsInDay.forEach(function(hourMoment){
                    
                    var purchasesThisHour = hoursOfPurchases.filter(function(purchaseMoment){
                        return hourMoment.hour() == moment(purchaseMoment).hour();
                    });
                
             
                var count = purchasesThisHour.length;
                
                purchasesPerUnit.push(count);
              
        
                
                });

        }
        
       
        //console.log(purchasesPerUnit);
        var newPurchases = purchasesPerUnit
        maxPurchases = max(newPurchases);
       // minPurchases = min(newPurchases);
        //avgPurchases = avg(newPurchases);
        //console.log(purchasesPerUnit);
////console.log(avg_rates);
//send results
     
                res.send({  
                            purchasesEachUnit:purchasesPerUnit,
                            status: "Success",
                            date:startDate,
                            avgPurchases:avgPurchases,
                            purchases:noOfPurchases,
                            maxPurchases:maxPurchases,
                            minPurchases:minPurchases,
                            units:units
                });
        });
    });
   


//****************GET THE AVERAGE OF ALL RATES FOR EACH DAY WITHIN A RANGE FOR A SPECIFIC SITE********************8

router.post('/:id/:range/averages',function(req,res){
    var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    var range = req.params.range
    //console.log("getting average rates for site:" + site + " in a range from " + start +" to " + end);
    Rate.get_avg_rates_for_range(site,start,end,function(err,rates){
    
         if (err){
             throw err
         };
         if (rates == null || rates.length == 0){ 
             //console.log("No Rates"); 
             res.send({status:"No Rates"});
             return ;
         }
          //get the difference in days between start and end of range.
        var startDate = moment(start);
////console.log(startDate);
        var endDate = moment(end);
////console.log(endDate);
        var diff = endDate.diff(startDate,'days');
////console.log(diff);
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
                for (i = 0; i < 10; ++i){
                    var dayHour = moment(startDate).utcOffset(-4).hours(8).minutes(0).seconds(0).add(i,'hours');
                        hrsInDay.push(dayHour);
                        units.push(dayHour.format('ha'));
                    }
                
                var momentsOfPurchases = rates.map(function(purchase){
                    return purchase.date
                });
                ////console.log(momentsOfPurchases)
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
                    ////console.log(hourMoment)
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
                    ////console.log(purchaseDurationsThisHour)
                    var totalDurations = total(purchaseDurationsThisHour)
                    var avgDurations = avg(purchaseDurationsThisHour)
                    avgTimeWaitingPerUnit.push(avgDurations)
                });

        }
////console.log(avg_rates);
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

router.post('/:id/:range/visits',function(req,res){
   var site = req.params.id;
    var start = req.body.start;
    var end = req.body.end;
    var range = req.params.range
    //console.log("getting total rates for site:" + site + " in a range from " + start +" to " + end);
    Rate.get_total_rates_for_range(site,start,end,function(err,rates){
    
         if (err){
             throw err
         };
         if (rates.length == 0){ 
             //console.log("No Rates"); 
             res.send({status:"No Rates"});
             return ;
         }
          //get the difference in days between start and end of range.
        var startDate = moment(start);
////console.log(startDate);
        var endDate = moment(end);
////console.log(endDate);
        var diff = endDate.diff(startDate,'days');
////console.log(diff);
        var days = [];
        var units = [];
        //create a group of arrays of rates for each specific day
        var avgVisits = 0;//the average of Visits made over period
        var visitsPerUnit = [];//per min or per hour or per day averaged purchase
        var noOfVisits = 0;//the amount of Visits made in the time period
        var maxVisits = 0;//the maximum number of visits in the entire time period
        var minVisits = 0;//the shortest number of visits in the entire time period
        
        var avgBounce = 0;//portion of visits that are missed conversions or non-sales
        var bouncesPerUnit = [];//bounces that occur per unit time measured
        var noOfBounces = 0;//number of Bounces total
        var maxBounces = 0;//max amount of bounces that occur in a unit
        var minBounces = 0;// minimum amount of bounces that have occured in a unit
        ////console.log("rates are "+ rates)
        var bounces = rates.filter(function(rateObj){
                    return rateObj.transaction == false;
            });
        var visits = rates;
        ////console.log("Visits are "+Visits)
            noOfVisits = visits.length;
            noOfBounces = bounces.length;
        if (diff > 0){
        //distinguishes whether searching for time period over multiple days or a single day
        //user is searching for info within one day. so sort for hours within 12 hour window: window length subject to change
         //create an array for each day listed
            for(i = 0; i < diff; i++){
                var day = moment(start).add(i,'days');
                days.push(day);
                units.push(day.format('Do'));
            }
            var daysOfBounces = bounces.map(function(bounce){
                    return moment(bounce.date).utcOffset(-4);
                });
            var daysOfVisits = visits.map(function(visit){
                    return moment(visit.date).utcOffset(-4);
                });
                //console.log(daysOfVisits);
            days.forEach(function(day,index){
                var thisDayBounces = daysOfBounces.filter(function(bounceDay){
                    return day.date() == moment(bounceDay).date()
                });
                var thisDayVisits = daysOfVisits.filter(function(visitDay){
                    return day.date() == moment(visitDay).date()
                });
                bouncesPerUnit.push(thisDayBounces.length);
                visitsPerUnit.push(thisDayVisits.length);
            }); 
        }else{
        //else searching within a range less than a day. analyze by the hour
         var hrsInDay = []//creates an array containing each hour in day 
                for (i = 0; i < 10; ++i){
                    var dayHour = moment(startDate).hours(8).minutes(0).seconds(0).add(i,'hours');
                            hrsInDay.push(dayHour);
                            units.push(dayHour.format('ha'));
                }
                ////console.log(hrsInDay);
                var hoursOfBounces = bounces.map(function(bounce){
                    return moment(bounce.date).utcOffset(-4);
                });
                var hoursOfVisits = visits.map(function(visit){
                    return moment(visit.date).utcOffset(-4);
                });
                //console.log(hoursOfVisits);
                //console.log(hrsInDay);
                hrsInDay.forEach(function(hourMoment){
                    var isLater = hourMoment.isAfter(moment().subtract(4,'hours'));
                    if(!isLater){
                        var bouncesThisHour = hoursOfBounces.filter(function(bounceMoment){
                            return hourMoment.hour() == moment(bounceMoment).hour();
                        });
                        var visitsThisHour = hoursOfVisits.filter(function(visitMoment){
                            return hourMoment.hour() == moment(visitMoment).hour();
                        });
                    var bounceCount = bouncesThisHour.length;
                    var visitCount = visitsThisHour.length;
                        bouncesPerUnit.push(bounceCount);   
                        visitsPerUnit.push(visitCount);
                    }
                });

        }
        
       
        //console.log(visitsPerUnit);
        var tempBounces = bouncesPerUnit//created to hold data just for calculating max and min values 
        maxBounces = max(tempBounces);
        minBounces = min(tempBounces);
        
        var tempVisits = visitsPerUnit//created to hold data just for calculating max and min values 
        maxVisits = max(tempVisits);
        minVisits = min(tempVisits);
        //avgVisits = avg(newVisits);
        //console.log(visitsPerUnit);
////console.log(avg_rates);
//send results
     
                res.send({  
                            visitsEachUnit:visitsPerUnit,
                            status: "Success",
                            date:startDate,
                            avgVisits:avgVisits,
                            visits:noOfVisits,
                            maxVisits:maxVisits,
                            minVisits:minVisits,
                            units:units
                });
                            
        
        });
    
    });
    
router.post('/:id/:range/conversions',function(req,res){
    var site = req.params.id
    var start = req.body.start
    var end = req.body.end
    var range = req.params.range
    //console.log("getting conversions for site:" + site + " in a range from " + start +" to " + end);
    Rate.get_stats(site,start,end,function(err,rates){
        if (err) throw err;
        
        if(rates.length == 0){
            res.send({status:"No Rates"})
            return 
        }
        ////console.log(rates)
        var purchasesPerUnit = []
        var visitsPerUnit = [];
        var bouncesPerUnit = [];
        var maxDiff = 0;
        var minDiff = 0;
        var conversionRate = 0;
        var noOfPurchases = 0;
        var noOfVisits = 0;
        var noOfBounces = 0;
        var startDate = moment(start);
        var endDate = moment(end);
        var diff = endDate.diff(startDate, range == "day" ? 'hours' : 'days');
        var days = [];
        var units = [];
        var conv_rate = 0;
        // separate all rates between customers or visitors
        var purchases = rates.filter(function(rateObj){
            return rateObj.transaction == true;
        });
        // console.log("There are "+purchases.length+" purchases")
        var visits = rates;
        var bounces = rates.filter(function(rateObj){
            return rateObj.transaction == false;
        });
        // console.log("There are "+visits.length+" visits")
        
        noOfPurchases = purchases.length;
        noOfVisits = visits.length
        var rawPercent = noOfPurchases/(noOfPurchases+noOfVisits)
            rawPercent *= 100
            //rawPercent = Math.floor(rawPercent)
        conv_rate = rawPercent.toFixed(2)
        if (range == "day"){
            var hrsInDay = []//creates an array containing each hour in day 
                for (i = 0; i < 10; ++i){
                    var dayHour = moment(startDate).hours(8).minutes(0).seconds(0).add(i,'hours');
                        hrsInDay.push(dayHour);
                        units.push(dayHour.format('ha'));
                    }
                var purchasesTime = [];
                
                hrsInDay.forEach(function(hour,index){//array of transactions each hour
                    var hourTrans = purchases.filter(function(transObj){
                        var transTime = moment(transObj.date).subtract(4,'hours');
                        return hour.isSame(transTime,'hour')
                    });
                    
                    var hourVisits = visits.filter(function(visitObj){
                         var visitTime = moment(visitObj.date).subtract(4,'hours');
                        return hour.isSame(visitTime,'hour')
                    });
                    //purchasesTime.push(hourTrans.map(function(obj){return obj.date;}))
                    purchasesPerUnit.push(hourTrans.length)
                    visitsPerUnit.push(hourVisits.length)
                });
            //  console.log(purchasesPerUnit);
            //  console.log(purchasesTime);
        }else{
            //create an array for each day listed
            for(i = 0; i < diff; ++i){
                var day = moment(start).add(i,'days');
                days.push(day);
                units.push(day.format('Do'));
            }
                days.forEach(function(day,index){
                    var dayTrans = purchases.filter(function(purchase){
                        return day.isSame(purchase.date,'date');
                    });
                    
                    var dayVisits = visits.filter(function(visitObj){
                        return day.isSame(visitObj.date,'date');
                    });
                    
                    purchasesPerUnit.push(dayTrans.length)
                    visitsPerUnit.push(dayVisits.length);
                });
            
        }

       
       
           
        var percentConversions = purchasesPerUnit.map(function(purchase,index){
            var visit = visitsPerUnit[index];
            return weedNaN(purchase/(purchase + visit));
        }).filter(function(conv){
            return conv != 0
        });
        //console.log(percentConversions)
        maxDiff = (max(percentConversions)*100).toFixed(2);
        minDiff = (min(percentConversions)*100).toFixed(2);  
        res.send({
                purchases:noOfPurchases,
                visits:noOfVisits,
                min:minDiff,
                max:maxDiff,
                conv_rate: conv_rate,
                conversions_per_hr:percentConversions,
                visitsPerUnit:visitsPerUnit,
                purchasesPerUnit:purchasesPerUnit,
                units:units
            });    
    });
});
module.exports = router;