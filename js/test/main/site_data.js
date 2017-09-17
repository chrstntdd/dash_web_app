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
       