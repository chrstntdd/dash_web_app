

    
function monthRates(site,month,forMonth){
    //     var monthRates = site.line_rates.filter(function(rate){
    //     var date = new Date(rate.date)
    //     //console.log('month is ' + month);
    //         return date.getMonth() == month;
    //         });

    // if(monthRates.length > 0){
    //      var rates = monthRates.map(function(rate){
    //     return rate.rate
    //      });
        
    //      var dates = monthRates.map(function(rate){
    //          return new Date(rate.date).toDateString();
    //      });
    //      var totalRates = rates.reduce(function(total,rate){
    //         return  total+rate
    //      });
    //      var average = totalRates/rates.length;
         
    //      var year = moment().year();
   
    //      var thisMonth =  moment({year: year, month: month, day: 1});
    //      var averages = [];
    //      if (forMonth){
    //      for (i = 0;i < moment(thisMonth).daysInMonth(); i++ ){
    //          var day = moment(thisMonth).add(i,'days');
    //          //console.log(day);
    //          var daysRates = monthRates.filter(function(rate){
    //             var same = moment(day).isSame(rate.date,'day');
    //             ///console.log(moment(rate.date,moment.ISO_8601).toDate());
    //             //console.log(rate.date);
    //             return same;
    //          }).map(function(rate){
    //              return rate.rate;
    //          });
    //          //console.log(daysRates);
    //          if(daysRates.length > 0){
    //              //console.log('there are rates')
                
    //             var totalRates = daysRates.reduce(function(total,rate){
    //                 return  total+rate
    //              });
                
    //             var average = totalRates/daysRates.length;
    //                 averages.push(average);

    //          }else{
    //                 averages.push(0);
    //          }
          
    //      }
      
    //      }
    //      return {rates: rates, dates: dates, average: average,averages: averages};
    //     }else{
    //           // console.log('no rates');
    //             return {rates:[],dates: [],avearage: 0}
    //         }
    }
function yearAverages(site,year){
    // var months = [0,1,2,3,4,5,6,7,8,9,10,11];
    // var averages = [];
    // if(year != null){
    //     return {year: year, averages: averages}
    // }else{
    //     year = moment().year();
    //     for (month in months){
    //      var monthData = monthRates(site,month,false);
    //      var monthAverage = monthData.average;
    //      averages.push(monthAverage);
    //     }
    // }
    // return {year: year,averages: averages};
}
   function monthAverage(site, month){
    //   if (month != null){
    //       var selectedMonth = "boo"
    //       var average = "boo boo"
    //         return {month: selectedMonth,average: average}
    //   }else{
    //         var thisMonthDays = moment().daysInMonth();
    //         var firstDay = moment('2017-02-01').startOf('month');
    //         var lastDayOfFirstWeek = moment(firstDay).endOf('week');
    //         var nextDayOfWeek = moment(lastDayOfFirstWeek).add(1,'day');
        
            
    //         var lastDay = moment().endOf('month');
    //         var firstDayOfLastWeek = moment(lastDay).startOf('week');
    //         var lastDayOfPrevWeek = moment(firstDayOfLastWeek).subtract(1,'day');
    //         var daysBetween = lastDay.diff(firstDay,'days');
    //         var days = [];
    //         for (i = 1; i < daysBetween; i++){
    //             days.push("");
    //         }
    //         var thisMonth = new Date().getMonth();
    //         var monthData = monthRates(site,thisMonth,true);

    //         return {month:moment().format('MMMM'),average: monthData.average,days: days,averages: monthData.averages}
    //   }
   }