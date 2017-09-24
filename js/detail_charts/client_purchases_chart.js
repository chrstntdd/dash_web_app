 function sec_mins(time){
        var min_sec = time < 1 ? "seconds" : "minutes"
        var time_for_seconds = time*60;
            time_for_seconds = Math.floor(time_for_seconds);
        time = time < 1 ? time_for_seconds : time;
       return time
     
}
 var cntxt = document.getElementById("client_purchases_cntxt").getContext('2d');
 
 var gradient = cntxt.createLinearGradient(0,0,0,400);
    gradient.addColorStop(0,'#82C4B2');
    gradient.addColorStop(1,'#4495E5');
 var gradientHover =  cntxt.createLinearGradient(0,0,0,400);
    gradientHover.addColorStop(0,'rgba(130,196,178,0.8');
    gradientHover.addColorStop(1,'rgba(68,149,229,0.8');      
var purchases_chart = new Chart(cntxt,{
            type: 'bar',
            data: {
                labels: ['8 am','9 am','10 am','11 am','12 pm','1 pm','2 pm','3 pm'],
                datasets:[{
                    data: [],
                    backgroundColor:gradient,
                    hoverBackgroundColor: gradientHover,
                    borderWidth: 1
                    }]
            },
            options: {
                tooltips:{
                    
                    callbacks:{
                        label: function(tooltipItem,data){
                            var amount = tooltipItem.yLabel;
                            return 'Purchases: ' + amount;
                        }
                    }
            },
                legend:{
                    display: false
                },
                scales: {
                    yAxes: [{
                        gridLines:{
                            display: false
                        },
                        ticks: {
                            beginAtZero:true,
                            fontSize: 18,
                            fontFamily: 'poiret'
                            }
                        }],
                    xAxes: [{
                        ticks:{
                            fontSize: 18,
                            fontFamily: 'poiret'
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                    }
            }
        })