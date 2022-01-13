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
        if(result.current_price > 1){
            $('#valor', clone).text(result.current_price.toFixed(2) + '€');
        }
        else{

            $('#valor', clone).text(result.current_price + '€');
        }   
        var color = result.price_change_24h < 0 ? 'red' : 'rgb(21, 223, 14)';
        $('#h24', clone).css('color', color);
        $('#h24', clone).text(result.price_change_percentage_24h.toFixed(2) + '%');
        $('#market-cap', clone).text(result.market_cap.toLocaleString() + '€');
        $('#favoritos', clone).attr('src', "a");
        $('tbody').append(clone);
    })
})

