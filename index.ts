import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';

const StartServer =async () => {
    
    const app = express();

    // await dbConnection()
    await App(app)
    const port = process.env.PORT || 8081
    app.listen(port, () => {console.log("TOJ running on port $port")})

}

StartServer()