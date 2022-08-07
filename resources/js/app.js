import axios from 'axios'
import toastr from 'toastr'
let addToCart = document.querySelectorAll('.add-to-cart');
let removeFromCart = document.querySelectorAll('.remove-from-cart');
let cartCounter = document.querySelector('.cartCounter')
let foodqty = document.querySelector('.foodqty')
let foodpr = document.querySelector('.food-pr')
let foodamt = document.querySelector('.food-amt')

function addCart(food){
   axios.post('/add-cart', food).then(res => {
        cartCounter.innerText = res.data.totalQty
        toastr.success('Item Added To Cart 🔥')
    }).catch((err) => {
        console.error(err);
        toastr.warning('Something Went Wrong 👀')
    })
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click', (e) => {
        let food = JSON.parse(btn.dataset.food)
        addCart(food)
    })
})

function removeCart(food){
   axios.post('/remove-cart', food).then(res => {
        cartCounter.innerText = res.data.totalQty
        toastr.success('Item Removed From Cart 😐')
    }).catch((err) => {
        toastr.warning('Something Went Wrong 👀')
    })
}

removeFromCart.forEach((btn) =>{
    btn.addEventListener('click', (e) => {
        console.log('hii')
        let food = JSON.parse(btn.dataset.food)
        removeCart(food)
    })
})