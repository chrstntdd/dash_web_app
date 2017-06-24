
var business_cntxt = document.getElementById("business_cntxt").getContext('2d');
var gradient = business_cntxt.createLinearGradient(0,0,0,400);
    gradient.addColorStop(0,'#82C4B2');
    gradient.addColorStop(1,'#4495E5');

var now = moment().minutes()
var times = []


for(i = 0 ;i < 30;i++){
    if (i%6 == 0){
     
        if(now-i >= 0){
            times.unshift(":" + (now - i))
        }else{
            times.unshift(":" + (now - i + 60))
        }
        
    }else{
    
        times.unshift("")
    }
}
var data = times.map(function(time){
    return Math.floor(Math.random() * 5 + 1);
});
var business_chart = new Chart(business_cntxt, {
        type: 'line',
        data:{
            labels: times,
            datasets:[{
                data: data,
                backgroundColor: gradient
                
            }]
            
        },
        options:{
                title:{
                    display:false,
                    fontFamily:'poiret',
                    fontSize: 20,
                    fontColor: '#34495e',
                    text: 'Business Last Half Hour'
                },
                 tooltips:{
                    enabled: false
                },
                legend:{
                    display: false
                },
                scales: {
                    yAxes: [{
                        scaleLabel:{
                            display:true,
                            labelString:"Sales Made",
                            fontFamily: "poiret",
                            fontSize: 40,
                            fontColor: '#34495e'
                            
                        },
                        gridLines:{
                            display: false
                        },
                        ticks: {
                            display: true,
                            beginAtZero:true
                            }
                        }],
                    xAxes: [{
                        scaleLabel:{ 
                            display: false,
                            labelString: "Business Last Half Hour",
                            fontFamily: "poiret",
                            fontSize: 40,
                            fontColor: '#34495e'
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                    }
            }
})