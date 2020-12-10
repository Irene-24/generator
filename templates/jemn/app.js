import cors from 'cors';
import express from "express";
import { json } from "body-parser";

const app = express();

app.use( cors() );
app.use( json() );

app.get( "/favicon.ico", ( req, res ) => 
{
    res.status( 200 ).end();
} );

app.get( [ "/", '/test' ], async ( req, res ) =>
{
    res.json( { message: 'Server is online!' } );
} );

app.use( ( req, res, next ) =>
{
    const err = new Error( "Resource not Found" );
    err.statusCode = 404;
    next( err );

} );

app.use( ( error, req, res, next ) =>
{
    const status = error.statusCode || 500;
    let data = error.data;

    res.status( status ).json(
        {
            error: error.message,
            data
        } );

} );

export default app;
