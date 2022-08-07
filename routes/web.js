const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middlewares/guest')

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
}

module.exports = initRoute;