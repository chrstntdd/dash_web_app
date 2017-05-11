var express = require('express');
var app = express();
var router = express.Router();
Site = require('../models/site');

function monthAverageFor(site){
    if (site.line_rates.length > 0){
    var monthRates = site.line_rates.filter(function(rate){
        var thisMonth = new Date().getMonth()
        return rate.date.getMonth() == thisMonth;
    })
    var rates = monthRates.map(function(rate){
        return rate.rate
    })
    if (rates.length > 0){
         var rateTotal = rates.reduce(function(total,rate){
        return total + rate})
     return rateTotal/monthRates.length
    }else{
        return "Not Enough Data"
    }

    }else{
        return "Not Enough Data"
    }
}

function weekAverageFor(site){
    if (site.line_rates.length > 0){
    var today = new Date()
    var todayWeekday = today.getDay()
    var todayDate = new Date().getDate()
    var daysAfterSunday = -todayWeekday
    var daysUntilSaturday = 6-todayWeekday
    var sunday = new Date()
        sunday.setDate(todayDate+daysAfterSunday)
    var saturday = new Date()
        saturday.setDate(todayDate+daysUntilSaturday)
    var ratesThisWeek = site.line_rates.filter(function(rate){
        return rate.date >= sunday && rate.date <= saturday
    })
    var rates = ratesThisWeek.map(function(rate){
        return rate.rate;
    })
   
    if (rates.length > 0){
          var rateTotal = rates.reduce(function(total,rate){
        return total + rate
    })
        return rateTotal/ratesThisWeek.length
    }else{
        return "Not Enough Data"
    }
    }else{
        return "Not Enough Data"
    }
}

function dayAverageFor(site){
     var todayRates = site.line_rates.filter(function(rate){
        var today = new Date().getDay()
        return rate.date.getDate() == today;
    })
    if (todayRates.length > 0){
   
    var rates = todayRates.map(function(rate){
        return rate.rate
    })
    
        if (rates.length > 0){
            var rateTotal = rates.reduce(function(total,rate){
        return total + rate
    })
             return rateTotal/todayRates.length
        }else{
            return "Not Enough Data"
        }
   
    }else{
        return "Not Enough Data"
    }
}
function json(object){
    return JSON.stringify(object);
}

router.get('/',function(req,res){
    if (req.session.user){
        var user = req.session.user
    //console.log(user.name)
        if (user.monitored_sites){
            //console.log(user.sites);
            Site.monitoredSites(user.monitored_sites,function(err,sites){
                if (sites){
                    res.render('sites',{
                        user:user,
                        sites:sites,
                        helpers: {
                           monthAverage: function(options){
                                return monthAverageFor(this);
                            },
                            dayAverage: function(options){
                                return dayAverageFor(this);
                            },
                            weekAverage: function(otions){
                                return weekAverageFor(this);
                            },
                            json: function(options){
                                return json(this);
                            }
                        }
                    })
                }
            });
        }else{
         res.render('sites',{user:user})
        }
        
    }else{
        res.render('index');
    }
   
});
router.get('/home',function(req,res){
    res.render('index');
})
router.get('/login',function(req,res){
    res.render('login')
});

module.exports = router;