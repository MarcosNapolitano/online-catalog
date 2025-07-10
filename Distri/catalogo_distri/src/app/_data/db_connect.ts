import dotenv from 'dotenv';
import mongoose from 'mongoose'
// import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@distri.scp8dpz.mongodb.net/Distri?&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("You're In!'");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

//try catch in case smth goes wrong
await mongoose.connect(uri).then(() => console.log("done"))
              .catch((err: Error) => console.error("Could ot connect to Database \n\n" + err));

//if error after connection
mongoose.connection.on('error', err => {
  console.error("Connection to DataBase lost\n\n" + err);
});

