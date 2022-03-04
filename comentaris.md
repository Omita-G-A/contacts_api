*recordatorio* En esta API vamos ha encargarnos de la parte de backend, por eso, por ejemplo,
en users.js solo tenemos una ruta post.

### Dimecres 2 de març

Al contrario del MVC que hicimos en PHP, aquí no necesitamos implementar diferentes
métodos para obtener contactos, editar, añadir, etc. Como usamos Mongoose, ya nos 
traemos sus propios métodos (que vienen a ser los de MongoDB).

Para capturar formularios de tipo multipart/formdata se usa un middleware llamado Multer.


### Dijous 3 de març

Afegim encriptació des password. Emplearem sa llibreria des paquet npm Bcrypt, i ho feim amb
async / await.
Llegir https://diego.com.es/encriptacion-y-contrasenas-en-php encara que sigui de php
explica bé s'encriptació i es hash.

Jsonwebtokem. Va amb callback. https://www.npmjs.com/package/jsonwebtoken
Es secreto des token se guarda a config, a des default.json, i hem d'afegir aquest
arxiu default a des gitignore.
En la autenticación de token en el ejemplo de fullstackopen.com se guarda la
palabra secreta en una variable de entorno process.env o (env.process), nosotros en
el config. Pero estaría bien revisar los ejemplos de esa página porque es muy parecido
a lo que estamos haciendo en esta app.
Variables de entorno son variables que están vinculadas al entorno del sistema,
no del usuario.

Després de hashear es password i implementar lo des token, començam amb ses verificacions.
Se faran amb express-validator. https://express-validator.github.io/docs/index.html
Revisar la documentación del express-validator para ver las otras formas de validar. Aquí
hemos usado check()(ver users.js:17), pero que hay diferentes maneras.

Revisar async / await

El login constará de un app.get y un app.post

### Divendres 4 de març

Implementam es métodes per eliminar i update es contactes.