 var current_cntxt = document.getElementById("client_conversions_cntxt").getContext('2d');
        var client_conversions_chart = new Chart(current_cntxt,{
            type: 'doughnut',
            data: {
                labels: ["Visits","Purchases"],
                datasets:[{
                    data: [],
                    backgroundColor:[
                        'rgba(241,196,15,1)',
                        'rgba(230,126,34,1)'
                        ],
                    borderColor: [
                        'rgba(243,156,18,1)',
                        'rgba(211,84,0,1'
                    ],
                    borderWidth: 1
                    }]
            }
        })