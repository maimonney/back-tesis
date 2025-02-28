const usuarioRuta = require('./usuarioRuta');
const vuelosRuta = require('./vuelosRuta');
const itinerarioRuta = require('./itinerarioRuta');
const hotelRuta = require('./hotelRuta');
const lugarRuta = require('./lugarRuta.js');
const turRuta = require('./turRuta.js');
const excursionRuta = require('./excursionRuta.js');
const cloudinaryRouter = require('./cloudinaryRutas.js'); 
const reservaTourRuta = require('./reservaTourRuta.js');
const mercadoPago = require('./mercadoPagoRuta.js');
const mailRuta = require('./mailRuta.js');

function routerAPI( app){
    app.use('/arcana/usuarios', usuarioRuta);
    app.use('/arcana/vuelos', vuelosRuta);
    app.use('/arcana/reservas',itinerarioRuta);
    app.use('/arcana/hoteles', hotelRuta);
    app.use('/arcana/destino', lugarRuta);
    app.use('/arcana/tur', turRuta);
    app.use('/arcana/excursiones', excursionRuta);
    app.use('/arcana/imagen', cloudinaryRouter);   
    app.use('/arcana/reservastour', reservaTourRuta);
    app.use('/arcana/pago', mercadoPago);
    app.use('/arcana/mail', mailRuta);

}

module.exports = routerAPI;