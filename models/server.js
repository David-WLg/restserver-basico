const express = require('express')
const cors = require('cors');
const router = require('../routes/usuarios');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares - Se llaman antes de routes
        this.middlewares();

        //Rutas
        this.routes();
        
    }

    routes(){
        
        this.app.use(this.usuariosPath, router)
          
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Servir la carpeta public
        this.app.use(express.static('public'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;