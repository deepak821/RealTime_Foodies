const Order = require('../../../models/orderModel')

const adminController = () => {
    return{
        async index(req, res){
            Order.find({status : {$ne : 'completed'}}, null, {sort : {'createdAt' : -1}}).populate('customerId', '-password').exec((err, order) => {
                if(req.xhr){
                    return res.json(order)
                }
                return res.render('admin/orders')
            })
        }
    }
}

module.exports = adminController