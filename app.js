const express = require('express');
const connectDB = require('./config/db');
const app = express();

// conectar con la base de datos
connectDB();

// middleware que intercepta las peticiones y parsea el json del
// body para devolvérnoslo en forma de objeto.
app.use(express.json());

// definimos las rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/login'));
app.use('/api/contacts', require('./routes/contacts'));

// default route
app.use('*', (req,res) => res.send('Instrucciones para usar la API.'));

const PORT = 3000;

app.get("/", (req, res) => res.json({msg: "hola desde express"}));
app.listen(PORT, () => console.log(`servidor arrancado en puerto ${PORT}`));