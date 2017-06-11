var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');


var rateSchema = new Schema({
        site: String,
        customer_id: String,
        duration: Number,
        date: {type: Date, default: Date.now}
});

var Rate = module.exports = mongoose.model('Rate',rateSchema);

module.exports.get_all_rates = function(site,callback){
    Rate.findById(site,callback);
};

module.exports.push_rates = function(rates,callback){
    var new_rates = [];
    rates.forEach(function(rate,index){
        Rate.find({site:rate.site,customer_id:rate.customer_id}, function(err,rate_to_update){
            
            if(err){
                console.log(err);
                return;
            }
            if(rate_to_update == null){
                console.log("adding new rate");
                new_rates.push(rate);
            }else{
                console.log("updating old rate");
               Rate.findOneAndUpdate({_id: rate_to_update._id}, {duration:rate.duration});
            }
        });
    });
    Rate.insertMany(new_rates,callback);
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
    Rate.find({site:site,date:{$gte:start,$lte:end}},function(err,rates){
        if (err) throw err;
          //get the difference in days between start and end of range.
        if (rates == null || rates.length == 0){ return "No Rates"}
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
                    return rateObject.duration;
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

//gets an array of all of the rates for the current day

module.exports.get_today_stats = function(site,start,end,callback){
    Rate.find({site:site,date:{$gte:start,$lte:end}},callback);
   
};
module.exports.get_avg_rates_for_range = function(site,start,end,callback){
    Rate.find({site:site,date:{$gte:start,$lte:end}},callback);
   
};

module.exports.get_total_rates_for_range = function(site,start,end,callback){
 Rate.find({site:site,date:{$gte:start,$lte:end}},callback);
        
};