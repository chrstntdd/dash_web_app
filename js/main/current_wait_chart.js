 var current_cntxt = document.getElementById("current_wait_cntxt").getContext('2d');
        var current_wait_chart = new Chart(current_cntxt,{
            type: 'bar',
            data: {
                labels: [" "," "," "," "," "],
                datasets:[{
                    data: [-1,-6,-3,-4,-7],
                    backgroundColor:[
                        'rgba(141,179,241,1)',
                        'rgba(141,179,241,1)',
                        'rgba(141,179,241,1)',
                        'rgba(141,179,241,1)',
                        'rgba(141,179,241,1)',
                        ],
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
                        // scaleLabel:{
                        //     display:true,
                        //     labelString:"Wait/Person",
                        //     // fontFamily: "poiret",
                        //     fontSize: 20,
                        //     fontColor: '#34495e'
                        // },
                        
                        gridLines:{
                            display: false
                        },
                        ticks: {
                            display: false,
                            beginAtZero:true
                            }
                        }],
                    xAxes: [{
                          position: 'top',
                        gridLines: {
                            display: false
                        }
                    }]
                    }
            }
        })