const Order = require('../../../models/orderModel')
const moment = require('moment')

const orderController = () => {
    return{
        async index(req, res){
            const orders = await Order.find({customerId : req.user._id}, null, {sort: {createdAt: -1}})
            res.header('Cache-Control', 'no-store')
            res.render("customers/orders", {orders: orders, moment: moment})
        },
        store(req, res){
            let { phone, address } = req.body
            if(!phone || !address){
                req.flash("error", "All fields are required")
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone,
                address
            })

            order.save().then((order) => {
                Order.populate(order, {path : 'customerId'}, (err, placeOrder) =>{
                    req.flash("success", "Order Placed Successfully")
                    delete req.session.cart
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', {order : placeOrder})
                    return res.redirect('/customer/orders')
                })
            }).catch(err => {
                console.error(err)
                req.flash("error", "Something went wrong")
                return res.redirect('/cart')
            })
        },
        async show(req, res){
            const order = await Order.findById(req.params.id)

            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrder', {order})
            }
            return res.redirect('/')
        }
    }
}

module.exports = orderController