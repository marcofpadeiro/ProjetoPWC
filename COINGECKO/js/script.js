'use strict';

var top_id=[0,0,0,0,0,0];


var cloneFila = $('#fila').clone(); 
$('#tbody').empty();
$.ajax({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
}).done(function(res){
    
    $.each(res, function(index, result){
       
        
        top_id=top3(result.price_change_percentage_24h,result.market_cap_rank,top_id[3],top_id[4],top_id[5],top_id[0],top_id[1],top_id[2]);
        
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
        $('#volume-total', clone).text(result.total_volume.toLocaleString() + '€');
        var checked = JSON.parse(localStorage.getItem("fav"));
        $('#fav', clone).val(checked);
        $("#fav").checked = checked;
        $('#tbody').append(clone);
        
    
    })
    console.log(top_id);
    function top3(price_change_24h ,id,price1,price2,price3,id1,id2,id3){

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

})


