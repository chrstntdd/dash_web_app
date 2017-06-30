 var cntxt = document.getElementById("conversion_comp_cntxt").getContext('2d');
 
 var gradient = cntxt.createLinearGradient(0,0,0,400);
    gradient.addColorStop(0,'#82C4B2');
    gradient.addColorStop(1,'#4495E5');
 var gradientHover =  cntxt.createLinearGradient(0,0,0,400);
    gradientHover.addColorStop(0,'rgba(130,196,178,0.8');
    gradientHover.addColorStop(1,'rgba(68,149,229,0.8');  

var compGradient = cntxt.createLinearGradient(0,0,0,400);
    compGradient.addColorStop(0,'rgba(241,196,15,1)');
    compGradient.addColorStop(1,'rgba(230,126,34,1)');
    
 var compGradientHover = cntxt.createLinearGradient(0,0,0,400);
    compGradientHover.addColorStop(0,'rgba(241,196,15,1)');
    compGradientHover.addColorStop(1,'rgba(230,126,34,1)');
                              
var conversion_comp_chart = new Chart(cntxt,{
            type: 'bar',
            data: {
                labels: ['8 am','9 am','10 am','11 am','12 pm','1 pm','2 pm','3 pm'],
                datasets:[{
                    data: [1,3,6,5,2],
                    backgroundColor:gradient,
                    hoverBackgroundColor: gradientHover,
                    borderWidth: 1
                },
                {
                  data: [0.5,1.5,3,2.5,3],
                    backgroundColor:compGradient,
                    hoverBackgroundColor: compGradientHover,
                    borderWidth: 1  
                }]
            },
            options: {
                 tooltips:{
                    enabled: false
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