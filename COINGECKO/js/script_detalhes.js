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
})
function Menu_Detalhes(){
    if(coins[id].fav == true){ $('#favoritos').attr('src', "../img/starcolor.png"); }
    else {$('#favoritos').attr('src', "../img/starnocolor.png");}
    $('#logo-detalhes').attr('src', coins[id].logo);
    $('#nome-detalhes').text(coins[id].nome);
    $('#abreviatura').text(coins[id].abreviatura);

}
function CliqueStar(star){
    if(coins[id].fav == false){
        
        star.attr('src', '../img/starcolor.png');
        coins[id].fav = true;
    } else {
        coins[id].fav = false;
        star.attr('src', '../img/starnocolor.png');
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