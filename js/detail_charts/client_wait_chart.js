var cntxt = document.getElementById("client_wait_cntxt").getContext('2d');
var gradient = cntxt.createLinearGradient(0,0,0,600);
    gradient.addColorStop(0,'#82C4B2');
    gradient.addColorStop(1,'#4495E5');

var wait_chart = new Chart(cntxt,{
    type: 'line',
    data:{
        labels: ['8am','9am','10am','11am','12am','1pm', '2pm','3pm','4pm','5pm','6pm'],
        datasets:[{
            data:[2,8,2,14,9,5,7,10,12,4,5],
            pointRadius: 0,
            backgroundColor: gradient
        }]
    },
    options:{
        legend: {
            display:false       
        },
        layout:{
            padding:{
                left:50,
                right:50,
                top:50,
                bottom:50
            }
        },
        scales:{
            yAxes:[{
                scaleLabel:{
                    fontSize: 20,
                    fontColor: '#ffffff',
                    display: true
                },
                 ticks:{
                    beginAtZero: true,
                    fontSize: 18,
                    fontFamily: 'poiret'
                },
                gridLines:{
                    display: false
                }
            }],
            xAxes:[{
                scaleLabel:{
                    fontSize: 20,
                    fontColor: '#ffffff',
                    display: true
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