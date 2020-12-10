import { connect } from "mongoose";
import { port, dbUrl } from "./config";
import app from "./app";

const options =
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true
};

connect( dbUrl, options )
    .then( () =>
    {
        console.log( "DB is connected" );

        app.listen( port, () =>
        {
            console.log( `Server is listening at port ${ port }` );
        } );

    } )
    .catch( ( err ) => console.log( err ) );
