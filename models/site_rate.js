var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var rateSchema = new Schema({
        site: String,
        customer_id: String,
        duration: Number,
        transaction: Boolean,
        date: {type: Date, default: Date.now},
        position: Number
        
});

var Rate = module.exports = mongoose.model('Rate',rateSchema);

module.exports.get_all_rates = function(site,callback){
    Rate.find({site:site},callback);
};

module.exports.push_rates = function(rates,callback){
    var new_rates = [];
    var error = null;
   // console.log(rates);
    rates.forEach(function(rate,index){
        //search for rates in same store, same customer id and position
        //console.log(rate);
        //could probably update this query to include the date
        var dayStart = moment().utcOffset(-4).startOf('day');
        var dayEnd = moment().utcOffset(4).endOf('day');
        Rate.find({site:rate.site,customer_id:rate.customer_id,position:rate.position,date:{$gte:dayStart,$lte:dayEnd}}, function(err,rate_to_update){
            if(err){
                error = err
                return ;
            }
            //if rates not found create 
            // console.log(rate_to_update);
            // console.log(rate_to_update.length+" rates to update");
            if(rate_to_update.length == 0){
                Rate.create(rate,function(err){error = err;});
            }else{
                // var ratesThisDay = rate_to_update.filter(function(rate){
                //     var sameDay = moment().isSame(rate.date,'day');
                //     return sameDay;
                // });
//console.log('rates this day are '+ ratesThisDay);
                rate_to_update.forEach(function(rateObj,place){
console.log("updating rate: \n"+rates[index]);
                //if the rate being posted is also being updated as purchase update the rate stored as well
                var transaction = rates[index].transaction == true ? true : rateObj.transaction;
                Rate.findOneAndUpdate({_id:rateObj._id},{duration:rates[index].duration,transaction:transaction},function(err){error = err;});

                });
            }
        });
    });
    
    callback(error,error == null ? "Succeed": "Failed to insert rates");
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

// module.exports.get_rates_for_range = function(site,start,end){
//     Rate.find({site:site,date:{$gte:start,$lte:end}},function(err,rates){
//         if (err) throw err;
//           //get the difference in days between start and end of range.
//         if (rates == null || rates.length == 0){ return "No Rates"}
//             var startDate = moment(start);
//             var endDate = moment(end);
//             var diff = startDate.diff(endDate,'days');
//             var days = [startDate];
//             //create an array for each day listed
//             for(i = 0; i < diff; i++){
//                 var day = startDate.add(i,'days');
//                 days.push(day);
//             }
//             //create a group of arrays of rates for each specific day
//             var day_rates = [];
//             var min_max = [];
//             for (day in days){
//              //map through each array and reduce the rates to a total or average as needed
//                 var rates_in_day = rates.filter(function(rateObject){
//                     return rateObject.date == day;
//                 }).map(function(rateObject){
//                     return rateObject.duration;
//                 });
//                 day_rates.push(rates_in_day);
//                 var sorted_rates = sortAscending(rates_in_day);
//                 var min = min(sorted_rates);
//                 var max = max(sorted_rates);
//                 min_max.push({min:min,max:max,date:day});
//             }
//             return {start: startDate, end: endDate, rates: day_rates,minMax: min_max};
//         });
// };

//gets an array of all of the rates for the current day

module.exports.get_stats = function(site,start,end,callback){
    //console.log("Getting stats for site " + site + " from " + start + " to " + end);
    Rate.find({site:site,date:{$gte:start,$lte:end}},callback);
   
};
module.exports.get_avg_rates_for_range = function(site,start,end,callback){
    Rate.find({transaction:true,site:site,date:{$gte:start,$lte:end}},callback);
};

module.exports.get_total_rates_for_range = function(site,start,end,callback){
 Rate.find({site:site,date:{$gte:start,$lte:end}},callback);
// Rate.find({transaction:true,site:site,date:{$gte:start,$lte:end}},callback);
};
module.exports.get_total_impressions_for_range = function(site,start,end,callback){
// Rate.find({transaction:false,site:site,date:{$gte:start,$lte:end}},callback);
Rate.find({site:site,date:{$gte:start,$lte:end}},callback);    
};
module.exports.identify_staff_equipment = function(site){
    Rate.find({site:site},function(err,sites){
        
    })
}