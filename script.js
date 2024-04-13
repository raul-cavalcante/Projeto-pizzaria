let modalQT = 1
let carrinho = []
let modalKey = 0

const p = (el) => document.querySelector(el)
const ps = (el) => document.querySelectorAll(el)

//listagens das izzas
pizzaJson.map((item, index) => {
    let pizzaitem = p('.pizza-item').cloneNode(true)

    pizzaitem.setAttribute('data-key', index)
    pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}` 
    pizzaitem.querySelector('.pizza-item--img img').src = item.img

    //evento para exibir o modal
    pizzaitem.querySelector('a').addEventListener('click', (e) =>{
        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQT = 1;
        modalKey = key

        p('.pizzaBig img').src = pizzaJson[key].img
        p('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        p('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        p('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

        p('.pizzaInfo--size.selected').classList.remove('selected')

        ps('.pizzaInfo--size').forEach((size, sizeindex)=>{
            if(sizeindex == 2){
                size.classList.add('selected')
            }
            
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex]
        })

        p('.pizzaInfo--qt').innerHTML = modalQT

        p('.pizzaWindowArea').style.opacity = 0
        p('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            p('.pizzaWindowArea').style.opacity = 1

        }, 100);

    })

    p('.pizza-area').append(pizzaitem)
})

//eventos do modal
function closeModal(){
    p('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        p('.pizzaWindowArea').style.display = 'none'

    }, 500)

}
ps('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})

//Quantidades de pizzas
p('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modalQT > 1){
        modalQT--
        p('.pizzaInfo--qt').innerHTML = modalQT
    }
})

p('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQT++
    p('.pizzaInfo--qt').innerHTML = modalQT
})

ps('.pizzaInfo--size').forEach((size, sizeindex)=>{
    size.addEventListener('click', (e)=>{
        p('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

//Qual pizza, tamanho e quantidade
p('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = Number(p('.pizzaInfo--size.selected').getAttribute('data-key'))

    let identificador = pizzaJson[modalKey].id+'@'+size

    let key = carrinho.findIndex((item)=> item.identificador == identificador)

    if(key > -1){
        carrinho[key].qt += modalQT
    } else{
        carrinho.push({
            identificador,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQT
        })
    } 

    atuCarrinho()
    closeModal()
    
})

p('.menu-openner').addEventListener('click', ()=>{
    if(carrinho.length > 0){
        p('aside').style.left = '0' 
    }
})
p('.menu-closer').addEventListener('click', ()=>{
    p('aside').style.left = '100vw'
})

//Carrinho
function atuCarrinho(){

//carrinho mobile
    p('.menu-openner span').innerHTML = carrinho.length



    if(carrinho.length > 0){
        p('aside').classList.add('show')
        p('.cart').innerHTML = ''

        let subTotal = 0
        let  desconto = 0
        let total = 0

        for(let i in carrinho){
            let pizzaitem = pizzaJson.find((item)=> item.id == carrinho[i].id)
            subTotal += pizzaitem.price * carrinho[i].qt

            let carrinhoItem = p('.models .cart--item').cloneNode(true)
            
            let pizzaSizeName
            switch(carrinho[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                    break    
            }

            let pizzaName = `${pizzaitem.name} (${pizzaSizeName})`

            carrinhoItem.querySelector('img').src = pizzaitem.img
            carrinhoItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            carrinhoItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].qt
            carrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(carrinho[i].qt > 1){
                    carrinho[i].qt--
                } else{
                    carrinho.splice(i,1)
                }
                atuCarrinho()
            })
            carrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                carrinho[i].qt++
                atuCarrinho()
            })

            p('.cart').append(carrinhoItem)
            
        }

        desconto = subTotal * 0.1
        total = subTotal - desconto

        p('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`
        p('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        p('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else{
        p('aside').classList.remove('show')
        p('aside').style.left = '100vw'
    }
}