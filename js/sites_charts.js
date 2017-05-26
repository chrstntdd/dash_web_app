


    var dayStart = moment().startOf('day');
    var dayEnd = moment().endOf('day');
    var monthStart = moment().startOf('month');
    var monthEnd = moment().endOf('month');
    getTodayQuickStats()
    getTotalRatesForRange(monthStart,monthEnd);
    getAverageRatesForRange(monthStart,monthEnd);

  var quick_ctx = $("#quick_polar_chart");
   
    var quick_chart = new Chart(quick_ctx,{
        type: 'polarArea',
        data: {
            datasets: [{
            data: [0,0,0,0],
            backgroundColor: ["#FF6384","#4BC0C0","#FFCE56","#E7E9ED"],
            label: 'Site Dataset' 
            }],
            labels: ["Clients Served","Average Wait","Min Outlier","Max Outlier"]
            },
        options: {
        elements: {
            arc: {
                borderColor: "#000000"
                }
            }
        }
    });
    



var total_ctx = $("#client_total_chart")
    var totalChart = new Chart(total_ctx,{
        type: 'line',
    data: {
        labels: [""],
        datasets: [{
            type: 'line',
            label: "# of Clients Served",
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(1g53, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
       ]
    },
    options: {
        scales: {
            yAxes: [{
                gridLines:{
                    display: false
            },
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
                gridLines:{
                    display:false
                }
            }]
        }
    }
    });


  var avg_ctx = $("#avg_wait_chart")
        var avgChart = new Chart(avg_ctx,{
        type: 'line',
    data: {
        labels: [""],
        datasets: [{
            type: 'line',
            label: "Average Wait per Client",
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
       ]
    },
    options: {
        scales: {
             yAxes: [{
                gridLines:{
                    display: false
            },
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
                gridLines:{
                    display:false
                }
            }]
        }
    }
    });

