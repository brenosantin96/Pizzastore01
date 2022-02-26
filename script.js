let cart = [];
let modalQt = 1;
let modalKey = 0;

//atalho para o querySelector
const c = (elemento) => {
    return document.querySelector(elemento);
}

//atalho para o querySelectorAll
const cs = (elemento) => {
    return document.querySelectorAll(elemento);
}

//LISTAGEM DAS PIZZAS
//primeiro argumento o item, segundo argumento o indice;
pizzaJson.map((item, index) => {
    //duplica a estrutura que foi feita em .models .pizza-item, apenas a estrutura.
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //usando o MAP, ele vai percorrer as classes que foram usadas no querySelector e alterar de acordo com nosso BD
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        //funcao closest acha o item mais proximo.... //o e.target é a imagem... por isso usamos o closest
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

        c('.pizzaInfo--size.selected').classList.remove('selected');

        //MEXENDO OS SIZES
        //Faz um querySelectorAll, para todos itens dessa classe vai pegar o size e colocar o size que pegou no pizzaJson
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    });


    //preencher as informacoes em pizza item;
    c('.pizza-area').append(pizzaItem);
});

//EVENTOS DO MODAL

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;


    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

//diminuir qtde de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }

});

//aumentar qtde de pizzas
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//selecionar o tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//adicionando ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', (e) => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //criando um identificador com o ID da pizza + size da pizza
    let identifier = pizzaJson[modalKey].id + '@' + size;

    //verificar no array se ja tem o item no carrinho!
    //o findIndex vai buscar o identifier da pizza;
    //a Key é só para saber qual o index da pizza....
    // O findIndex vai retornar o indice do elemento que achar no array, caso contrario retorna MENOS 1
    let key = cart.findIndex((item) => {
        return item.identifier == identifier;
    });

    //se FOR MAIOR QUE -1 é porque tem o ITEM no array, ai edita apenas a quantidade!
    if (key > -1) {
        cart[key].qt += modalQt;
    } else { //se no caso não for maior que -1, vai adicionar uma pizza...
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id, //o id da pizza
            size: size, //o tamanho da pizza dito ali em cima
            qt: modalQt //a quantidade
        })
    }

    updateCart(); //atualizando o carrinho antes de fechar.
    closeModal();
});


c('.menu-openner').addEventListener('click',()=> {
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left ='100vw';
})

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        //fazer um for no carrinho para pegar item a item e exibir na tela com o HTML ja criado... 
        c('.cart').innerHTML = '';


        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) { //percorrendo cada item no carrinho
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); //atribuindo ao pizzaItem a pizza que tem no carrinho, buscando no PizzaJson o item que tem o mesmo id da que tem no carrinho
            
            subtotal += pizzaItem.price * cart[i].qt;
            
            //pegando a estrutura
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //preenchendo as informacoes
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', (e) => {
                
                if(cart[i].qt > 1){
                    cart[i].qt--; //alterando a variavel especifica da pizza.
                } else {
                    cart.splice(i, 1); //remove um item a partir do indice i, segundo parametro qtde.
                }
                
                updateCart();
            });

            //mto interessante alterar variavel apenas de um item especifico... usou o FOR..
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', (e) => {
                cart[i].qt++; //alterando a variavel especifica da pizza.
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
    

}

