const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { PORT } = require('./config/serverConfig')

const apiRoutes = require('./routes/index')
const db = require('./models/index')



const prepareAndStartServer = () => {
    
    //here we are setting body-Parser as a middleware
    //this wiil help us to read the requested body properly 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api',apiRoutes);
    app.listen(PORT,async()=>{
        console.log(`Server started on PORT: ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter: true});
        }
    })
}

prepareAndStartServer();