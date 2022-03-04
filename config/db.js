const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


// para conectar con la base de datos creamos una
// función y usaremos el 
// sistema de async/await
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
       
        })
        console.log('conectado a Mongo.');
    } catch(error) {
        console.log(error.message);
        // también se suele hacer esto:
        // no dejar levantar el servidor si no podemos conectar
        // con la base de datos, no arrancaría la aplicación si 
        // hay algún error
        process.exit(1);
    }
}

module.exports = connectDB;