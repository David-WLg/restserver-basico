const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            category: '/api/category',
            product: '/api/product',
            search: '/api/search',
            upload: '/api/upload'
        }

        //conectar a la base de datos
        this.conectDB();

        //Middlewares - Se llaman antes de routes
        this.middlewares();

        //Rutas
        this.routes();

    }

    async conectDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Servir la carpeta public
        this.app.use(express.static('public'));

        // Cargar archivos
        this.app.use(fileUpload( { useTempFiles: true, tempFileDir: '/tmp/', createParentPath: true } ));
    }

    routes() {

        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.category, require('../routes/category'));
        this.app.use(this.paths.product, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.upload, require('../routes/upload'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;