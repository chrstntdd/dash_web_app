    var dayStart = moment().startOf('day');
    var dayEnd = moment().endOf('day');
    var monthStart = moment().startOf('month');
    var monthEnd = moment().endOf('month');
    getTodayQuickStats();
    // getTotalRatesForRange(monthStart,monthEnd);
    // getAverageRatesForRange(monthStart,monthEnd);
   $(document).ready(function(){
           $('[data-toggle="popover"]').popover();
       });
       