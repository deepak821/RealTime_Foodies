import axios from 'axios'
import toastr from 'toastr'
import moment from 'moment'
import { initAdmin } from './admin'
let addToCart = document.querySelectorAll('.add-to-cart');
let removeFromCart = document.querySelectorAll('.remove-from-cart');
let cartCounter = document.querySelector('.cartCounter')
let alertMsg = document.querySelector('success-alert')
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

if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}


// order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);


//socket

let socket = io()

if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname

if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    toastr.success(`Order is ${data.status}`)
})
