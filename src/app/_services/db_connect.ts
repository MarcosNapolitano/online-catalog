import mongoose, { Connection } from 'mongoose'

export async function databaseConnect(){

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@distri.scp8dpz.mongodb.net/Distri?&w=majority`;

    try{ await mongoose.connect(uri); }

    catch(err){ console.error("Could not connect to Database \n\n" + err); };

    //if error after connection
    mongoose.connection.once('error', err => {
        console.error("Connection to DataBase lost\n\n" + err);
    });

};

export default function DatabaseConnects<T extends (...args: any[]) => Promise<any>>(fn: T): T {

  const connect = async (): Promise<Connection | void> => {

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@distri.scp8dpz.mongodb.net/Distri?&w=majority`;
    try { await mongoose.connect(uri); }
    catch (err) { console.error("Could not connect to Database \n\n" + err); };


    //if error after connection
    return mongoose.connection.once('error', err => {
      console.error("Connection to DataBase lost\n\n" + err);
    });
  };

  const close = async (conn: Connection): Promise<void> => {

    if (!conn) return console.warn("no connection to close.");

    try { conn.close() }
    catch { console.error("error trying to close connection.") };

  };

  return (async function(...args: any[]) {

    const Conn = await connect();

    if (Conn) {

      const retValue = await fn(...args);
      close(Conn);

      return retValue;

    };
  }) as T;
};
