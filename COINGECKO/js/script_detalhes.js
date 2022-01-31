'use strict'
var id = localStorage.getItem('id');
var coins = [];
var favoritos = [];
if (JSON.parse(localStorage.getItem("favoritos"))== null){
    for (var i= 0; i < 100; i++){
        favoritos[i]=false;
    }
}else {
    favoritos = JSON.parse(localStorage.getItem("favoritos"));
}
$.ajax({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
}).done(function(res){
    var i = 0;
    $.each(res, function(index, result){
        coins[i] = {
            id: result.market_cap_rank,
            nome: result.name,
            logo: result.image,
            name_id:result.id,
            valor: result.current_price > 1 ? result.current_price.toFixed(2) : result.current_price,
            h24: result.price_change_percentage_24h,
            marketcap: result.market_cap.toLocaleString(),
            volume: result.total_volume.toLocaleString(),
            fav: favoritos[i] ,
            abreviatura: result.symbol.toUpperCase()

        };
        i++;
    })
    Menu_Detalhes();
    requestAPI_graph()
    
    
})

function requestAPI_graph(){
        $.ajax({
            method: "GET",
            url: "https://api.coingecko.com/api/v3/coins/"+ coins[id].name_id +"/market_chart?vs_currency=eur&days=90&interval=daily"
        }).done(function(res){
                console.log(res.prices);
                var limit = res.prices.length;    //increase number of dataPoints by increasing the limit
                var highest = 0;
                for(var i = 0; i < res.prices.length; i++){
                    highest = res.prices[0][1] > highest ? res.prices[0][1] : highest;
                }  
                var data = [];
                var dataSeries = { type: "line" };
                var dataPoints = [];
                for (var i = 0; i < limit ; i++) {
                    
                    dataPoints.push({
                        x: i,
                        y: res.prices[i][1]
                    });
                }
                dataSeries.dataPoints = dataPoints;
                data.push(dataSeries);
        
                //Better to construct options first and then pass it as a parameter
                var options = {
                    backgroundColor: "#142749",
                    width:900,
                    height:280,
                    
                    axisX:{
                        lineColor:  "rgb(102, 167, 189)",
                        labelFontColor: "rgb(102, 167, 189)",
                        tickColor: "#142749",
                        gridColor: "#142749",
                        interval: 10
                    },
                    axisY:{
                        lineColor:  "rgb(102, 167, 189)",
                        labelFontColor: "rgb(102, 167, 189)",
                        tickColor: "#142749",
                        gridColor: "#142749",
                        suffix:"€",
                        
                    },
                    
                    animationEnabled: true,
                    title: {
                        fontColor: "rgb(102, 167, 189)",
                        text: "90 dias"
                    },
                    data: [
                    ],
                    data
                };
        
                $("#chartContainer").CanvasJSChart(options);
                $('.canvasjs-chart-credit').html(' ');
        })
    }
function Menu_Detalhes(){

    if(coins[id].fav == true){ $('#favoritos').attr('src', "../img/starcolor.png"); }
    else {$('#favoritos').attr('src', "../img/starblackwhite.png");}
    $('#logo-detalhes').attr('src', coins[id].logo);
    $('#nome-detalhes').text(coins[id].nome);
    $('#abreviatura').text(coins[id].abreviatura);
    $('#preco-moeda').text(coins[id].valor);
    var color = coins[id].h24 < 0 ? 'red' : 'rgb(21, 223, 14)';
    $('#h24-moeda').css('color', color);
    $('#h24-moeda').text(coins[id].h24.toFixed(2) + '%');
    $('#valor-moeda').text(coins[id].valor + '€');
    $('#volume-moeda').text(coins[id].volume + '€');
    $('#market-moeda').text(coins[id].marketcap + '€');
    if(coins[id].id == 1){ 
    $('#rank-moeda').addClass('top1');
     $('#rank-moeda').removeClass('top2');
     $('#rank-moeda').removeClass('top3');
    } else if(coins[id].id == 2){
        $('#rank-moeda').addClass('top2');
        $('#rank-moeda').removeClass('top1');
        $('#rank-moeda').removeClass('top3');
    } else if(coins[id].id == 3){
        $('#rank-moeda').addClass('top3');
        $('#rank-moeda').removeClass('top1');
        $('#rank-moeda').removeClass('top2');
    } else {
        $('#rank-moeda').removeClass('top1');
        $('#rank-moeda').removeClass('top2');
        $('#rank-moeda').removeClass('top3');
    }
    $('#rank-moeda').text('#' + coins[id].id);
}
function CliqueStar(star){
    if(coins[id].fav == false){
        star.attr('src', '../img/starcolor.png');
        coins[id].fav = true;
    } else {
        coins[id].fav = false;
        star.attr('src', '../img/starblackwhite.png');
    }
    var array = [];
    for(var i = 0; i < coins.length; i++){
        if(coins[i].fav == true){
            array[i] = true;
        } else {
            array[i] = false;
        }
    }
    localStorage.setItem("favoritos", JSON.stringify(array));
}
function search_coin() {
    var input = $('#pesquisa').val(); // vai buscar input
    for (i = 0; i < coins.length; i++) { 
        if (coins[i].nome.toLowerCase() == input || coins[i].abreviatura.toLowerCase() == input || coins[i].id == input) {
            id = coins[i].id -1;
            Menu_Detalhes();
            requestAPI_graph()
        }
        
        
    }
}