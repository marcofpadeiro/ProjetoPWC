'use strict'
var id = localStorage.getItem('id');
var coins = [];
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
            valor: result.current_price > 1 ? result.current_price.toFixed(2) : result.current_price,
            h24: result.price_change_percentage_24h,
            marketcap: result.market_cap.toLocaleString(),
            volume: result.total_volume.toLocaleString(),
            fav: true
        };
        i++;
    })
    Menu_Detalhes();
})
function Menu_Detalhes(){
    $('#logo-detalhes').attr('src', coins[id].logo);
    $('#nome-detalhes').text(coins[id].nome);
}