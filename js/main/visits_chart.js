 var current_cntxt = document.getElementById("visits_cntxt").getContext('2d');
        var visits_chart = new Chart(current_cntxt,{
            type: 'bar',
            data: {
                labels: [" "," "," "," "," "],
                datasets:[{
                    data: [-1,-3,-6,-5,-2],
                    backgroundColor:[
                        'rgba(144,131,226,1)',
                        'rgba(144,131,226,1)',
                        'rgba(144,131,226,1)',
                        'rgba(144,131,226,1)',
                        'rgba(144,131,226,1)'
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