import dotenv from 'dotenv';
import mongoose from 'mongoose'
// import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@distri.scp8dpz.mongodb.net/Distri?&w=majority`;

try{ await mongoose.connect(uri); }

catch(err){ console.error("Could not connect to Database \n\n" + err); };

//if error after connection
mongoose.connection.on('error', err => {
  console.error("Connection to DataBase lost\n\n" + err);
});

