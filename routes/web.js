const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/adminController');
const statusController = require('../app/http/controllers/admin/statusController');
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

const initRoute = (app) =>{
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postregister)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)
    app.post('/add-cart', cartController().add)
    app.post('/remove-cart', cartController().remove)

    // customer
    app.get('/customer/orders', auth, orderController().index)
    app.post('/order', auth, orderController().store)
    app.get('/customer/orders/:id', auth, orderController().show)

    //admin
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoute;