    var dayStart = moment().startOf('day').utcOffset(-4,true);
    var dayEnd = moment().endOf('day').utcOffset(-4,true);
    var monthStart = moment().startOf('month');
    var monthEnd = moment().endOf('month');
    console.log("do things");
    getTodayQuickStats();
    // getTotalRatesForRange(monthStart,monthEnd);
    // getAverageRatesForRange(monthStart,monthEnd);
   
   $(document).ready(function(){
           $('[data-toggle="popover"]').popover();
       });
       