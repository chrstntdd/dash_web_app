 var current_cntxt = document.getElementById("purchases_cntxt").getContext('2d');
        var purchases_chart = new Chart(current_cntxt,{
            type: 'bar',
            data: {
                labels: [" "," "," "," "," "],
                datasets:[{
                    data: [],
                    backgroundColor:[
                        'rgba(79,179,175,1)',
                        'rgba(79,179,175,1)',
                        'rgba(79,179,175,1)',
                        'rgba(79,179,175,1)',
                        'rgba(79,179,175,1)'
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