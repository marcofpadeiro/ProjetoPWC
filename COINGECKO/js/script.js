'use strict';
$.ajax({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
}).done(function(res){
    var coins = [];
    var i = 0;
    $.each(res, function(index, result){
        coins[i] = {
            id: result.market_cap_rank,
            nome: result.name,
            logo: result.image,
            valor: result.current_price > 1 ? result.current_price.toFixed(2) : result.current_price,
            h24: result.price_change_percentage_24h,
            marketcap: result.market_cap.toLocaleString(),
            volume: result.total_volume.toLocaleString(),
            fav: true
        };
        i++;

    })
    mostra_top_3(coins);
    mostra_tabela(100, coins);
    
    
})
function mostra_tabela(numero, coins){
    var cloneFila = $('#fila').clone(); 
    var clone = [];
    $('#tbody').empty();
    for(var i = 0; i < numero; i++){
        clone[i] = cloneFila.clone();
        $('#id', clone[i]).text(coins[i].id);
        $('#nome', clone[i]).text(coins[i].nome);
        $('#logo-coin', clone[i]).attr('src', coins[i].logo);
        $('#valor', clone[i]).text(coins[i].valor + '€');
        var color = coins[i].h24 < 0 ? 'red' : 'rgb(21, 223, 14)';
        $('#h24', clone[i]).css('color', color);
        $('#h24', clone[i]).text(coins[i].h24.toFixed(2) + '%');
        $('#market-cap', clone[i]).text(coins[i].marketcap + '€');
        $('#volume-total', clone[i]).text(coins[i].volume + '€');
        if(coins[i].fav == true){ $('#star', clone[i]).attr('src', "../img/starcolor.png"); }
        else {$('#star', clone[i]).attr('src', "../img/starnocolor.png");}
        $('#tbody').append(clone[i]);
    }
}
function mostra_top_3(coins){
    var cloneCaixa = $('.caixas').clone();
    var top_moeda = top_moedas(coins);
    var clone = [];
    $('.top3').empty(); 
    for(var i = 0; i < 3; i++){
        clone[i] = cloneCaixa.clone();
        $('#logo-coin-top', clone[i]).attr('src', top_moeda[i].logo);
        $('#nome-top', clone[i]).text(top_moeda[i].nome);
        $('#valor-top', clone[i]).text(top_moeda[i].valor + '€');
        var color = top_moeda[i].h24 < 0 ? 'red' : 'rgb(21, 223, 14)';
        $('#h24-top', clone[i]).css('color', color);
        $('#h24-top', clone[i]).text('+' + top_moeda[i].h24.toFixed(2) + '%');
        $('#ranking-top', clone[i]).text('#' + top_moeda[i].id);
        $('.top3').append(clone[i]);
    }
}
function top_moedas(coins){
    var top = [];
    top[0] = coins[0];
    top[1] = coins[0];
    top[2] = coins[0];
    for(var i = 3; i < 100; i++){
        if(coins[i].h24 > top[0].h24){
            top[2] = top[1];
            top[1] = top[0];
            top[0] = coins[i];
        } else if(coins[i].h24 > top[1].h24){
            top[2] = top[1];
            top[1] = coins[i];
        } else if(coins[i].h24 > top[2].h24){
            top[2] = coins[i];
        }
    }
    return {
        0:top[0],
        1:top[1],
        2:top[2] 
    };
   

}



