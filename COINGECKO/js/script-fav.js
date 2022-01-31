'use strict';

window.onload = function() {
    requestAPI();
};

// VARIAVEIS GLOBAIS
var coins = [];
var favoritos = [];
var ordemTabela = [];
var cloneCaixa = $('.caixas').clone();
var cloneFila = $('#fila').clone();
var cloneFilaMsg = $('#fila-mensagem').clone()
var currency = "eur";
var numero = 100;

// LOCALSTORAGE
currency = localStorage.getItem("currency") == null ? "eur" : localStorage.getItem("currency");
if(currency == "eur"){
    $('#usd').removeClass("focado");
    $('#euro').removeClass("nao-focado");
    $('#usd').addClass("nao-focado");
    $('#euro').addClass("focado");
    
} else {
    $('#euro').removeClass("focado");
    $('#usd').removeClass("nao-focado");
    $('#euro').addClass("nao-focado");
    $('#usd').addClass("focado");
}
if (JSON.parse(localStorage.getItem("favoritos"))== null){
    for (var i= 0; i < 100; i++){
        favoritos[i]=false;
    }
}else {
    favoritos = JSON.parse(localStorage.getItem("favoritos"));
}


for(var i = 0; i < 100; i++){
    ordemTabela[i] = i;
}
  
// Funçaõ que muda a moeda (USD ou EUR)
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
    localStorage.setItem("currency", currency);
    requestAPI();
}

// Funçaõ que faz um request à API
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
                mostrar: true,
                abreviatura: result.symbol
            };
            i++;
        })
        mostra_tabela();
        mostra_top_h24(3);
    })
}

// Funçao que mostra a tabela principal
function mostra_tabela(){
    
    var clone = [];
    var j = 0;
    $('#tbody').empty();
    var i = 0;
    for(i = 0; i < numero; i++){
        var index = ordemTabela[i]; 
        if(coins[index].mostrar == true && coins[index].fav == true){
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
            j++;
        }
    }
    if(j == 0){
        clone[index] = cloneFilaMsg.clone();
        $(clone[index]).val(index);
        $('#mensagem', clone[index]).text("Não existe nenhum favorito!");
        $('#tbody').append(clone[index]);
    }
}

// Funçao que funciona como toggle entre TOP 100 e TOP 10
function toggleTop10(top){
    if(top == 'top10'){
        numero = 10;
        $('#top100').removeClass("focado");
        $('#top10').removeClass("nao-focado");
        $('#top100').addClass("nao-focado");
        $('#top10').addClass("focado");
       
    } else {
        numero = 100;
        $('#top10').removeClass("focado");
        $('#top100').removeClass("nao-focado");
        $('#top10').addClass("nao-focado");
        $('#top100').addClass("focado");
        
    }
    mostra_tabela();
}

// Funçao que apaga os favoritos
function apagaTodos(){
    for(var i = 0;i < numero; i++){
        coins[i].fav=false;
    }
    localStorage.removeItem("favoritos");
    mostra_tabela();
}

// Funçao que mostra a tabela 'Top Rising'
function mostra_top_h24(numero){
    var top = descobreOrdem("crescente", "h24");
    var clone = [];
    $('.top4').empty(); 
    for(var i = 0; i < numero; i++){
        var index = top[i];
        clone[index] = cloneCaixa.clone();
        $('#logo-coin-top', clone[index]).attr('src', coins[index].logo);
        $('#nome-top', clone[index]).text(coins[index].nome);
        var sign = currency == "eur" ? "€" : "$";
        $('#valor-top', clone[index]).text(coins[index].valor + sign);
        var color = coins[index].h24 < 0 ? 'red' : 'rgb(6, 167, 54)'; 
        $('#h24-top', clone[index]).css('color', color);
        $('#h24-top', clone[index]).text('+' + coins[index].h24.toFixed(2) + '%');
        $('#ranking-top', clone[index]).text('#' + parseInt(index+1));
        $('.top4').append(clone[index]);
    }
}

// Funçao que descobre a ordem da tabela dependendo dos parametros
function descobreOrdem(ordem, baseDados){
    var aux = 0, aux_i = 0;
    var valor= [];
    var indices=[];
    
        for(var i = 0; i < coins.length; i++){
            switch(baseDados){
                case 'id': valor[i] = parseFloat(coins[i].id); break;
                case 'valor': valor[i] = parseFloat(coins[i].valor); break;
                case 'h24': valor[i] = parseFloat(coins[i].h24); break;
                case 'volume': valor[i] = parseFloat(coins[i].volume); break;
            }
            indices[i] = i;
        }
        
        for (var i = 0; i < coins.length; i++) {
            for (var j = i; j < coins.length; j++) {
                if(ordem == "crescente"){
                    if (valor[j] > valor[i]) {
                        aux = valor[j];
                        aux_i = indices[j];
                        valor[j] = valor[i];
                        indices[j] = indices[i]; 
                        valor[i] = aux;
                        indices[i] = aux_i;
                    }
                } else if(ordem == "decrescente"){
                    if (valor[j] < valor[i]) {
                        aux  = valor[j];
                        aux_i = indices[j];
                        valor[j] = valor[i];
                        indices[j] = indices[i]; 
                        valor[i] = aux;
                        indices[i] = aux_i;
                    }
                }
            }
        }
    
    
    return indices;
}

// Funçao que ordena a tabela dependendo da ordem escolhida
function OrdenarTabela(item, o){
    switch(o){
        case '1':
            ordemTabela = descobreOrdem("crescente", "id");
            $(item).attr('value', '2');
            break;
        case '2': 
            // ordem id decrescente 
            ordemTabela = descobreOrdem("decrescente", "id");
            $(item).attr('value', '1');
            break;
        case '3': 
            ordemTabela = descobreOrdem("crescente", "valor");
            $(item).attr('value', '4');
            break;
        case '4': 
            ordemTabela = descobreOrdem("decrescente", "valor");
            $(item).attr('value', '3');
            break;
        case '5': 
            ordemTabela = descobreOrdem("crescente", "h24");
            $(item).attr('value', '6');
            break;
        case '6': 
            ordemTabela = descobreOrdem("decrescente", "h24");
            $(item).attr('value', '5');
            break;
        case '7': 
            ordemTabela = descobreOrdem("crescente", "volume");
            $(item).attr('value', '8');
            break;
        case '8': 
            ordemTabela = descobreOrdem("decrescente", "volume");
            $(item).attr('value', '7');
            break;
    }
    mostra_tabela(numero);
}



// Funçao que redireciona para a pagina favoritos
function redirecionaPaginaDetalhes(id){
    localStorage.setItem('id', id);
    location.href = 'detalhes.html';
}

// Funçao que adiciona aos favoritos
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
    mostra_tabela();
}

// Funçao que procura por moedas
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
    mostra_tabela();
}


