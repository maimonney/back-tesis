const usuarioRuta = require('./usuarioRuta');
const vuelosRuta = require('./vuelosRuta');
const reservasRuta = require('./reservasRuta');
const hotelRuta = require('./hotelRuta');
const lugarRuta = require('./lugarRuta.js');
const turRuta = require('./turRuta.js');
const excursionRuta = require('./excursionRuta.js');
const serpapi = require('./serpApiRuta.js');

function routerAPI( app){
    app.use('/arcana/usuarios', usuarioRuta);
    app.use('/arcana/vuelos', vuelosRuta);
    app.use('/arcana/reservas',reservasRuta);
    app.use('/arcana/hoteles', hotelRuta);
    app.use('/arcana/lugares', lugarRuta);
    app.use('/arcana/tur', turRuta);
    app.use('/arcana/excursiones', excursionRuta);
    app.use('/arcana/api', serpapi);
}

module.exports = routerAPI;