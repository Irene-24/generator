import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 7272,
    dbUrl = process.env.MONGODB_URI ||
        'mongodb://localhost:27017/kryztalz';

export
{
    port,
    dbUrl,
};
