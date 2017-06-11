    function getTodayQuickStats(){
            var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        var stats = JSON.parse(this.responseText);
                        console.log(stats);
                        if (stats != "No Rates"){
                           $("#current_wait").text(stats.avg_rate)
                           current_chart.datasets[0].data = stats.today_rates
                        }
                    }
                };
                xmlhttp.open("GET","/api/rates/{{site._id}}/today",true);
                xmlhttp.send();
        }
        
    function getRange(start,end){
            var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        var rates = JSON.parse(this.responseText);
                        console.log(rates);
                    }
                };
                xmlhttp.open("POST","/api/rates/{{site._id}}/range",true);
                xmlhttp.setRequestHeader("Content-Type","application/json");
                var range = JSON.stringify({start:start,end:end});
                xmlhttp.send(range);
        }
    function getTotalRatesForRange(start,end){
            
            var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        var results = JSON.parse(this.responseText);
                        console.log(results);
                        if (results == "No Rates"){
                            console.log("no rates");
                            alert("Sorry, No Data for specified period");
                        }else{
                            console.log("Some Rates");
                            totalChart.data.datasets[0].data = results.clientsPerDay;
                            totalChart.data.labels = results.clientsPerDay;
                            totalChart.update();
                        }
                    }
                };
                
                xmlhttp.open("POST","/api/rates/{{site._id}}/range/total",true);
                xmlhttp.setRequestHeader("Content-Type","application/json");
                var range = JSON.stringify({start:start,end:end});
                xmlhttp.send(range);
        }
    
    function getAverageRatesForRange(start,end){
            var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        var results = JSON.parse(this.responseText);
                        console.log(results);
                        avgChart.data.datasets[0].data = results.avg_rates;
                        avgChart.data.labels = results.days;
                        avgChart.update();
                    }
                };
                xmlhttp.open("POST","/api/rates/{{site._id}}/range/averages",true);
                xmlhttp.setRequestHeader("Content-Type","application/json");
            var range = JSON.stringify({start:start,end:end});
                xmlhttp.send(range);
        }