const mongoose = require('mongoose');


// los schemas de mongoose esperan que le pasemos un objeto.
const ContactSchema = new mongoose.Schema({
    user: { // esto que estamos haciendo en la propiedad user es como
        // una especie de inner join para relacionar la colección de 
        // Users con la de Contacts
        type: mongoose.Schema.Types.ObjectId, // referencia al usuario
        ref: 'users' // la referencia es a la collection de Mongo
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    type: {
        type: String,
        default: "Personal"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('contact', ContactSchema);