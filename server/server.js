const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        //conectar a la base de datos
        this.conectDB();

        //Middlewares - Se llaman antes de routes
        this.middlewares();

        //Rutas
        this.routes();
        
    }

    async conectDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Servir la carpeta public
        this.app.use(express.static('public'));
    }

    routes(){
        
        this.app.use(this.usersPath, require('../routes/users'))
          
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;