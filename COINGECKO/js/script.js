'use strict';
var coins = [];
var favoritos = [];
var ordemTabela = [];
var cloneCaixa = $('.caixas').clone();
var currency = "eur";
var numero = 100;
for(var i = 0; i < 100; i++){
    ordemTabela[i] = i;
}
            
var cloneFila = $('#fila').clone()
if (JSON.parse(localStorage.getItem("favoritos"))== null){
    for (var i= 0; i < 100; i++){
        favoritos[i]=false;
    }
}else {
    favoritos = JSON.parse(localStorage.getItem("favoritos"));
}
window.onload = function() {
    requestAPI();
};

function changeCurrency(cur){
    if(cur == "eur"){
        
        $('#usd').removeClass("focado");
        $('#euro').removeClass("nao-focado");
        $('#usd').addClass("nao-focado");
        $('#euro').addClass("focado");
        if(currency != "eur"){
            currency = "eur";
        }
        
        
        
    } else {
        currency = "usd";
        $('#euro').removeClass("focado");
        $('#usd').removeClass("nao-focado");
        $('#euro').addClass("nao-focado");
        $('#usd').addClass("focado");
        if(currency != "usd"){
            currency = "usd";
        }
    }
    requestAPI();
}
function requestAPI(){
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+ currency + "&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
    }).done(function(res){
        var i = 0;
        
        $.each(res, function(index, result){
            coins[i] = {
                id: result.market_cap_rank,
                nome: result.name,
                logo: result.image,
                valor: result.current_price >= 1 ? result.current_price.toFixed(2) : result.current_price,
                h24: result.price_change_percentage_24h,
                marketcap: result.market_cap,
                volume: result.total_volume,
                fav: favoritos[i]   ,
                mostrar:true,
                abreviatura: result.symbol
            };
            i++;
        })
        mostra_top_4();
        mostra_tabela();
    })
}

function OrdenarTabela(item, o){
    var aux = 0, aux_i = 0;
    var valor = [], h24 = [], marketCap = [], volume_total = [];
    switch(o){
        case '1':
            // ordem id crescente
            for(var i = 0; i < 100; i++){
                ordemTabela[i] = i;
            }
            $(item).attr('value', '2');
            break;
        case '2': 
            // ordem id decrescente 
            for(var i = 0; i < 100; i++){
                ordemTabela[i] = 99 - i;
            }
            $(item).attr('value', '1');
            break;
        case '3': // ordem valor crescente
            aux = 0, aux_i = 0;
            var valor = [];
            for(var i = 0; i < coins.length; i++){
                valor[i] = parseFloat(coins[i].valor);
                ordemTabela[i] = i;
            }

            for (var i = 0; i < coins.length; i++) {
                for (var j = i; j < coins.length; j++) {
                    if (valor[j] > valor[i]) {
                        aux = valor[j];
                        aux_i = ordemTabela[j];
                        valor[j] = valor[i];
                        ordemTabela[j] = ordemTabela[i]; 
                        valor[i] = aux;
                        ordemTabela[i] = aux_i;
                    }
                }
            }
            $(item).attr('value', '4');
            break;
        case '4': 
            aux = 0, aux_i = 0;
            for(var i = 0; i < coins.length; i++){
                valor[i] = parseFloat(coins[i].valor);
                ordemTabela[i] = i;
            }
            for (var i = 0; i < coins.length; i++) {
                for (var j = i; j < coins.length; j++) {
                    if (valor[j] < valor[i]) {
                        aux  = valor[j];
                        aux_i = ordemTabela[j];
                        valor[j] = valor[i];
                        ordemTabela[j] = ordemTabela[i]; 
                        valor[i] = aux;
                        ordemTabela[i] = aux_i;
                    }
                }
            }
            $(item).attr('value', '3');
            break;
        case '5': 
            aux = 0, aux_i = 0;
            for(var i = 0; i < coins.length; i++){
                h24[i] = parseFloat(coins[i].h24);
                ordemTabela[i] = i;
            }
            for (var i = 0; i < coins.length; i++) {
                for (var j = i; j < coins.length; j++) {
                    if (h24[j] > h24[i]) {
                        aux  = h24[j];
                        aux_i = ordemTabela[j];
                        h24[j] = h24[i];
                        ordemTabela[j] = ordemTabela[i]; 
                        h24[i] = aux;
                        ordemTabela[i] = aux_i;
                    }
                }
            }
            $(item).attr('value', '6');
            break;
        case '6': 
            aux = 0, aux_i = 0;
            for(var i = 0; i < coins.length; i++){
                h24[i] = parseFloat(coins[i].h24);
                ordemTabela[i] = i;
            }
            for (var i = 0; i < coins.length; i++) {
                for (var j = i; j < coins.length; j++) {
                    if (h24[j] < h24[i]) {
                        aux  = h24[j];
                        aux_i = ordemTabela[j];
                        h24[j] = h24[i];
                        ordemTabela[j] = ordemTabela[i]; 
                        h24[i] = aux;
                        ordemTabela[i] = aux_i;
                    }
                }
            }
            $(item).attr('value', '5');
            break;
        case '7': 
            aux = 0, aux_i = 0;
            for(var i = 0; i < coins.length; i++){
                volume_total[i] = parseInt(coins[i].volume);
                ordemTabela[i] = i;
            }
            for (var i = 0; i < coins.length; i++) {
                for (var j = i; j < coins.length; j++) {
                    if (volume_total[j] > volume_total[i]) {
                        aux  = volume_total[j];
                        aux_i = ordemTabela[j];
                        volume_total[j] = volume_total[i];
                        ordemTabela[j] = ordemTabela[i]; 
                        volume_total[i] = aux;
                        ordemTabela[i] = aux_i;
                    }
                }
            }
            $(item).attr('value', '8');
            break;
        case '8': 
            aux = 0, aux_i = 0;
            for(var i = 0; i < coins.length; i++){
                volume_total[i] = parseInt(coins[i].volume);
                ordemTabela[i] = i;
            }
            for (var i = 0; i < coins.length; i++) {
                for (var j = i; j < coins.length; j++) {
                    if (volume_total[j] < volume_total[i]) {
                        aux  = volume_total[j];
                        aux_i = ordemTabela[j];
                        volume_total[j] = volume_total[i];
                        ordemTabela[j] = ordemTabela[i]; 
                        volume_total[i] = aux;
                        ordemTabela[i] = aux_i;
                    }
                }
            }
            $(item).attr('value', '7');
            break;
    }
    mostra_tabela(numero);
}
function mostra_tabela(){
    
    var clone = [];
    $('#tbody').empty();
    var i = 0;
    for(i = 0; i < numero; i++){
        var index = ordemTabela[i];    
        if(coins[index].mostrar == true){
            clone[index] = cloneFila.clone();
            $(clone[index]).val(index);
            $('#id', clone[index]).text(coins[index].id);
            $('#nome', clone[index]).text(coins[index].nome);
            $('#logo-coin', clone[index]).attr('src', coins[index].logo);
            var sign = currency == "eur" ? "€" : "$";
            
            $('#valor', clone[index]).text(coins[index].valor + sign);
            var color = coins[index].h24 < 0 ? 'red' : 'rgb(21, 223, 14)';
            $('#h24', clone[index]).css('color', color);
            $('#h24', clone[index]).text(coins[index].h24.toFixed(2) + '%');
            $('#market-cap', clone[index]).text(coins[index].marketcap.toLocaleString() + sign);
            $('#volume-total', clone[index]).text(coins[index].volume.toLocaleString() + sign);
            $('#index', clone[index]).val(index);
            if(coins[index].fav == true){ $('#favoritos', clone[index]).attr('src', "../img/starcolor.png"); }
            else {$('#favoritos', clone[index]).attr('src', "../img/starnocolor.png");}
            $('#tbody').append(clone[index]);
        }
    }
}
function toggleTop10(){
    if(numero == 100){
        numero = 10;
        $('#showTop10').html("Top 100");
    } else {
        numero = 100;
        $('#showTop10').html("Top 10");
    }
    mostra_tabela();
}
function mostra_top_4(){
    
    var top_moeda = top_moedas();
    var clone = [];
    $('.top4').empty(); 
    for(var i = 0; i < 4; i++){
            clone[i] = cloneCaixa.clone();
            $('#logo-coin-top', clone[i]).attr('src', top_moeda[i].logo);
            $('#nome-top', clone[i]).text(top_moeda[i].nome);
            var sign = currency == "eur" ? "€" : "$";
            $('#valor-top', clone[i]).text(top_moeda[i].valor + sign);
            var color = top_moeda[i].h24 < 0 ? 'red' : 'rgb(6, 167, 54)'; 
            $('#h24-top', clone[i]).css('color', color);
            $('#h24-top', clone[i]).text('+' + top_moeda[i].h24.toFixed(2) + '%');
            $('#ranking-top', clone[i]).text('#' + top_moeda[i].id);
            $('.top4').append(clone[i]);
    }
}

function top_moedas(){
    var top = [];
    top[0] = coins[0];
    top[1] = coins[0];
    top[2] = coins[0];
    top[3] = coins[0];
    for(var i = 4; i < 100; i++){
        if(coins[i].h24 > top[0].h24){
            top[3] = top[2];
            top[2] = top[1];
            top[1] = top[0];
            top[0] = coins[i];
        } else if(coins[i].h24 > top[1].h24){
            top[3] = top[2];
            top[2] = top[1];
            top[1] = coins[i];
        } else if(coins[i].h24 > top[2].h24){
            top[3] = top[2];
            top[2] = coins[i];
        } else if(coins[i].h24 > top[3].h24){
            top[3] = coins[i];
        } 
    }
    return {
        0:top[0],
        1:top[1],
        2:top[2],
        3:top[3] 
    };
}
function redirecionaPaginaDetalhes(id){
    localStorage.setItem('id', id);
    location.href = 'detalhes.html';
}
function CliqueStar(id, star){
    if(coins[id].fav == false){
        star.removeClass('favoritos-rem');
        star.addClass('favoritos-add');
        star.attr('src', '../img/starcolor.png');
        coins[id].fav = true;
    } else {
        star.removeClass('favoritos-add');
        star.addClass('favoritos-rem');
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
function search_coin() {
    var input = $('#pesquisa').val().toLowerCase(); // vai buscar input

    for (i = 0; i < coins.length; i++) { 
        if (coins[i].nome.toLowerCase().includes(input) || coins[i].abreviatura.toLowerCase().includes(input) || coins[i].id + 1 == input) {
            coins[i].mostrar = true;
        }
        else {
            coins[i].mostrar = false;        
        }
        
    }
    mostra_tabela(100);
}
