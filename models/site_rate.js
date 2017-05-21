var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');


var rateSchema = new Schema({
        site: String,
        rate: Number,
        date: {type: Date, default: Date.now}
});

var Rate = module.exports = mongoose.model('Rate',rateSchema);

module.exports.get_all_rates = function(site,callback){
    Rate.findById(site,callback);
};

module.exports.push_rates = function(rates,callback){
    Rate.create(rates,callback);
};

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
module.exports.get_rates_for_range = function(site,start,end){
    Rate.find({_id:site,date:{$gte:start,$lte:end}},function(err,rates){
        if (err) throw err;
          //get the difference in days between start and end of range.
        var startDate = moment(start);
        var endDate = moment(end);
        var diff = startDate.diff(endDate,'days');
        var days = [startDate];
        //create an array for each day listed
        for(i = 0; i < diff; i++){
            var day = startDate.add(i,'days');
            days.push(day);
        }
        //create a group of arrays of rates for each specific day
        var day_rates = [];
        var min_max = [];
        for (day in days){
         //map through each array and reduce the rates to a total or average as needed
            var rates_in_day = rates.filter(function(rateObject){
                return rateObject.date == day;
            }).map(function(rateObject){
                return rateObject.rate;
            });
            day_rates.push(rates_in_day);
            var sorted_rates = sortAscending(rates_in_day);
            var min = min(sorted_rates);
            var max = max(sorted_rates);
            min_max.push({min:min,max:max,date:day});
        }
        return {start: startDate, end: endDate, rates: day_rates,minMax: min_max};
        });
};

module.exports.get_avg_rates_for_range = function(site,start,end,callback){
    Rate.find({_id:site,date:{$gte:start,$lte:end}},function(err,rates){
         if (err) throw err;
          //get the difference in days between start and end of range.
        var startDate = moment(start);
        var endDate = moment(end);
        var diff = startDate.diff(endDate,'days');
        var days = [startDate];
        //create an array for each day listed
        for(i = 0; i < diff; i++){
            var day = startDate.add(i,'days');
            days.push(day);
        }
        //create a group of arrays of rates for each specific day
        var avg_rates = [];
      
        for(day in days){
         //map through each array and reduce the rates to a total or average as needed
            var rates_in_day = rates.filter(function(rateObject){
                return rateObject.date == day;
            }).map(function(rateObject){
                return rateObject.rate;
            }).reduce(function(total,rate){
                return total + rate;
            });
            avg_rates.push(rates_in_day/days.length);
        }
        
        return {start: startDate, end: endDate, avg_rates:avg_rates,days:days}
        });
};

module.exports.get_total_rates_for_range = function(site,start,end,callback){
 Rate.find({_id:site,date:{$gte:start,$lte:end}},function(err,rates){
        if (err) throw err;
        
          //get the difference in days between start and end of range.
        var startDate = moment(start);
        var endDate = moment(end);
        var diff = startDate.diff(endDate,'days');
        var days = [startDate];
        //create an array for each day listed
        for(i = 0; i < diff; i++){
            var day = startDate.add(i,'days');
            days.push(day);
        }
        //create a group of arrays of rates for each specific day
        var day_rates = [];
      
        for (day in days){
         //map through each array and reduce the rates to a total or average as needed
            var rates_in_day = rates.filter(function(rateObject){
                return rateObject.date == day;
            }).map(function(rateObject){
                return rateObject.rate;
            }).reduce(function(total,rate){
                return total + rate;
            });
            day_rates.push(rates_in_day);
            
        }
          return {start: startDate, end: endDate, total_rates:day_rates,days:days}
        });
};