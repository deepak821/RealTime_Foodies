const Menu = require('../../models/menuModel')
const homeController = () => {
    return{
        async index(req, res){
            const foods = await Menu.find();
            res.render('home', {foods : foods});
        }
    }
}

module.exports = homeController;