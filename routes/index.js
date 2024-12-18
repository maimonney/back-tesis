const usuarioRuta = require('./usuarioRuta');
const vuelosRuta = require('./vuelosRuta');
const reservasRuta = require('./reservasRuta');
const hotelRuta = require('./hotelRuta');
const lugarRuta = require('./lugarRuta.js');
const excursionRuta = require('./excursionRuta.js');

function routerAPI( app){
    app.use('/arcana/usuarios', usuarioRuta);
    app.use('/arcana/vuelos', vuelosRuta);
    app.use('/arcana/reservas',reservasRuta);
    app.use('/arcana/hoteles', hotelRuta);
    app.use('/arcana/lugares', lugarRuta);
    app.use('/arcana/excursiones', excursionRuta);
}

module.exports = routerAPI;