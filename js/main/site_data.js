function sortDescending(values){
    var sorted = values.sort(function(a,b){
        return b-a;
    });
    return sorted;
}
function sortAscending(values){
    var sorted = values.sort(function(a,b){
        return a-b;
    });
    return sorted;
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
function setRange(range){
        switch (range){
            case "day":
              $("#time_period_sel").daterangepicker({
                    singleDatePicker: true,
                    startDate: moment()
                    },
                    function(start,end,label){
                        start = start.hour(8).minute(0);
                        end = moment(start).hour(17);
                        $(".time_period_text").text(start.format('MMM Do YYYY'));
                        getConversionsForRange(start,end,"day")
                    }
                ); 
                break
            case "week":
                $("#time_period_sel").daterangepicker({
                    singleDatePicker: false,
                    startDate: moment(),
                    endDate: moment().add(1,'weeks')
                    },
                    function(start,end,label){
                        start = start.hour(8).minute(0);
                        end = moment(start).hour(17);
                        $(".time_period_text").text(start.format('MMM Do YYYY'));
                        getConversionsForRange(start,end,"week")
                    }
                );
                break;
            case "month":
                $("#time_period_sel").daterangepicker({
                    singleDatePicker: false,
                    startDate: moment(),
                    endDate: moment().add(1,'months')
                    },
                    function(start,end,label){
                        start = start.hour(8).minute(0);
                        end = moment(start).add
                        $(".time_period_text").text(start.format('MMM Do YYYY'));
                        getConversionsForRange(start,end,"month");
                    }
                );
                break
            default: break
        }
} 
    function setStepSize(topUnit){
        var steps = [1,2,3,4,5,6,10,20,100]
        var step = 0;
        steps.forEach(function(i){
            if(topUnit > 5*i){
                step = i
            }
        })
        return step
    }
  
       