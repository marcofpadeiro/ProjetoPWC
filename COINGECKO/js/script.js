'use strict';

var cloneFila = $('.fila').clone(); 
$('tbody').empty();
$.ajax({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
}).done(function(res){
    
    $.each(res, function(index, result){
        console.log(result);
        
        var clone = cloneFila.clone();
        $('#id', clone).text(result.market_cap_rank);
        $('#nome', clone).text(result.name);
        $('#logo-coin', clone).attr('src', result.image);
        
        $('#valor', clone).text(result.current_price + '€');
        $('#24h', clone).text(result.price_change_24h + '€');
        $('#favoritos', clone).attr('src', "a");
        $('tbody').append(clone);
    })
})

