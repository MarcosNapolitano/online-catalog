import { IProduct, Product } from './data';
import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';
import mongoose, { Connection } from 'mongoose'
import { readFromCsv } from './csv-json';

//strings for error handling
const saveError = "Could not save Product in database\n\n";
const findError = "Could not find Product in database\n\n";

function DatabaseConnects<T extends (...args: any[]) => Promise<any>>(fn: T): T {

    const connect = async (): Promise< Connection | void > => {
        dotenv.config();  

        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@distri.scp8dpz.mongodb.net/Distri?&w=majority`;
            try{ await mongoose.connect(uri); }
        catch(err){ console.error("Could not connect to Database \n\n" + err); };


        //if error after connection
        return mongoose.connection.on('error', err => {
            console.error("Connection to DataBase lost\n\n" + err);
        });
    };

    const close = async(conn: Connection): Promise<void> => {

        if (!conn) return console.warn("no connection to close.");

        try { conn.close() }
        catch { console.error("error trying to close connection.") };

    };

    return (async function (...args: any[]) { 

        const Conn = await connect();

        if (Conn) {

            const retValue = await fn(...args);
            close(Conn);

            return retValue;

        };
    }) as T;
};

export const createProduct = DatabaseConnects(async () => {

    const data = await readFromCsv();
    if (!data) return;

    const products: Array<IProduct> = [];

    //we skip the firt row!
    for (let i = 5; i < data.length; i+=5) {
        const product: IProduct = new Product;

        product.sku = data[i];
        product.name = data[i + 1];
        product.orden = parseInt(data[i + 2]);
        product.price = new mongoose.Types.Decimal128(data[i + 3]);
        product.url = data[i];
        product.section = "Galletitas";

        if (data[i + 4] === "Si") product.active = true;
        else product.active = false;

        console.log(product);
        products.push(product);
    }
    
    try {

        console.log("begin insertion!");
        await Product.insertMany(products);
        console.log("insertion complete!");
    }

    catch { console.error("could not insert products!") };
});


export const findProducts = DatabaseConnects(async () => {

    //find and display all products
    try{ return await Product.find({}); }
    catch(err) { 
        console.error(findError + err );
        return undefined;
    };
});

export const writeBaseJson = async (data: Array<IProduct>): Promise<void> => {

    try {
        await writeFile('./src/app/_data/current.json', JSON.stringify(data));
    }
    catch (err) { console.error(err); }

}

export const readFromJson = async (): Promise<Array<IProduct> | void > => {

    try{
        const data = await readFile('./src/app/_data/current.json', 'utf8');
        return JSON.parse(data);
    }
    catch (err) { return console.error(err); }
}
