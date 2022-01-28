'use strict';

var top_id=[0,0,0,0,0,0];
var coins = [];
var i = 0;


$.ajax({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
}).done(function(res){
    $.each(res, function(index, result = [i]){
        coins[i] = {
            id: result.market_cap_rank,
            nome: result.name,
            logo: result.image,
            valor: result.current_price > 1 ? result.current_price.toFixed(2) : result.current_price,
            h24: result.price_change_percentage_24h.toFixed(2),
            marketcap: result.market_cap.toLocaleString(),
            volume: result.total_volume.toLocaleString(),
            fav: 0
        };
        top_id=top3(coins[i].h24, coins[i].id, top_id[0], top_id[1], top_id[2], top_id[3], top_id[4], top_id[5]);
        i++;
        
    })
    mostra_top_3(3, top_id, coins);
    mostra_tabela(100);
    
    console.log(top_id);
})

function mostra_tabela(numero){
    var cloneFila = $('#fila').clone(); 
    $('#tbody').empty();
    for(i = 0; i < numero; i++){
        var clone = cloneFila.clone();
        $('#id', clone).text(coins[i].id);
        $('#nome', clone).text(coins[i].nome);
        $('#logo-coin', clone).attr('src', coins[i].logo);
        $('#valor', clone).text(coins[i].valor + '€');
        var color = coins[i].h24 < 0 ? 'red' : 'rgb(21, 223, 14)';
        $('#h24', clone).css('color', color);
        $('#h24', clone).text(coins[i].h24 + '%');
        $('#market-cap', clone).text(coins[i].marketcap + '€');
        $('#volume-total', clone).text(coins[i].volume + '€');
        $('#fav', clone);
        $('#tbody').append(clone);
    }
}
function mostra_top_3(numero, top3, coins){
    var cloneCaixa = $('.caixas').clone();
    $('.top3').empty(); 
    for(i = 0; i < numero; i++){
        var clone = cloneCaixa.clone();
        $('#logo-coin-top', clone).attr('src', coins[top3[i] - 1].logo);
        $('#nome-top', clone).text(coins[top3[i] - 1].nome);
        $('#valor-top', clone).text(coins[top3[i] - 1].valor + '€');
        var color = coins[i].h24 < 0 ? 'red' : 'rgb(21, 223, 14)';
        $('#h24-top', clone).css('color', color);
        $('#h24-top', clone).text(coins[top3[i] - 1].h24 + '%');
        $('.top3').append(clone);
    }
}
function top3(price_change_24h ,id, id1, id2, id3, price1, price2, price3){
    if (price_change_24h > price1)
    {
        price3=price2;
        id3=id2;
        price2=price1
        id2=id1;
        price1=price_change_24h;
        id1=id;
    } else if(price_change_24h > price2){
        price3=price2;
        id3=id2;
        price2=price_change_24h;
        id2=id;
    }else if(price_change_24h > price3){
        price3=price_change_24h;
        id3=id;
    }
   
    return {
        0:id1,
        1:id2,
        2:id3,
        3:price1,
        4:price2,
        5:price3
    };
   

}


