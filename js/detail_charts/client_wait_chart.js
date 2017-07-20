var cntxt = document.getElementById("client_wait_cntxt").getContext('2d');
var gradient = cntxt.createLinearGradient(0,0,0,600);
    gradient.addColorStop(0,'#82C4B2');
    gradient.addColorStop(1,'#4495E5');

var wait_Chart = new Chart(cntxt,{
    type: 'bar',
    data:{
        labels: ['8am','9am','10am','11am','12am','1pm', '2pm','3pm'],
        datasets:[{
            data:[],
            pointRadius: 0,
            backgroundColor: gradient
        }]
    },
    options:{
        title:{
            display:true,
            fontSize:18,
            fontColor:"333333",
            fontFamily:"poiret",
            text:"Average Wait per unit"
            
        },
        legend: {
            display:false       
        },
        layout:{
            padding:{
                left:50,
                right:0,
                top:50,
                bottom:0
            }
        },
        scales:{
            yAxes:[{
                scaleLabel:{
                    fontSize: 15,
                    fontColor: '#333333',
                    display: false,
                    labelString:"Minutes Waiting"
                },
                 ticks:{
                    beginAtZero: true,
                    fontSize: 18,
                    fontFamily: 'poiret',
                    callback: function(value,index,values){
                        return     value.toFixed(1)
                    }
                },
                gridLines:{
                    display: false
                }
            }],
            xAxes:[{
                scaleLabel:{
                    fontSize: 15,
                    fontColor: '#333333',
                    display: true,
                    labelString: "Time"
                },
                ticks:{
                    fontSize:18,
                    fontFamily: 'poiret'
                },
                gridLines:{
                    display: false
                }
            }]
        }

    }
})