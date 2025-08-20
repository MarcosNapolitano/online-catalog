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

  const connect = async (): Promise<Connection | void> => {
    dotenv.config();

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@distri.scp8dpz.mongodb.net/Distri?&w=majority`;
    try { await mongoose.connect(uri); }
    catch (err) { console.error("Could not connect to Database \n\n" + err); };


    //if error after connection
    return mongoose.connection.on('error', err => {
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

/** Connects to database and creates products from csv */
export const createProduct = DatabaseConnects(async () => {

  const data = await readFromCsv();
  if (!data) return;

  const products: Array<IProduct> = [];

  for (let i = 0; i < data.length; i += 8) {
    const product: IProduct = new Product;

    product.sku = data[i];
    product.name = data[i + 1];
    product.price = new mongoose.Types.Decimal128(data[i + 2]);
    product.price2 = new mongoose.Types.Decimal128(data[i + 3]);
    product.active = data[i + 4] == "true" ? true : false;
    product.orden = parseInt(data[i + 5]);
    product.section = data[i + 6];
    product.url = data[i];
    product.sectionOrden = parseInt(data[i + 7]);

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

/** Save sigle product to database */
export const saveProduct = DatabaseConnects(async (prod: IProduct) => {

  try { await prod.save() }
  catch (err) { console.error(saveError + err) };

});

/** Save several product to database */
export const saveProducts = DatabaseConnects(async (prods: IProduct[]) => {

  try { await Product.insertMany(prods) }
  catch (err) { console.error(saveError + err) };

});

/** Find and display all products ordered by section and category */
export const findProducts = DatabaseConnects(async () => {

  try { return await Product.find({}).sort({ sectionOrden: "asc", orden: "asc" }).lean<IProduct[]>(); }
  catch (err) {
    console.error(findError + err);
    return undefined;
  };
});

/** Find and display all products but only the name and section
since this is used to populate a simple product list*/
export const findProductsSimplified = DatabaseConnects(async () => {

  try {
    return await Product.find({}, { name: 1, section: 1, sku: 1, _id: 0 })
      .lean<IProduct[]>();
  }
  catch (err) {
    console.error(findError + err);
    return undefined;
  };
});

/** Find product by order, used to insert product on database */
export const findProductbyOrder = DatabaseConnects(async (section: string, orden: number): Promise<IProduct[]> => {

  try { return await Product.find({ section: section, orden: { $gte: orden } }) }
  catch (err) {
    console.error(findError + err);
    return [];
  };


});

/** Find and display a single product based on a given sku */
export const findSingleProduct = DatabaseConnects(async (sku: string) => {

  try { return await Product.findOne({ sku }, { _id: 0 }); }
  catch (err) {
    console.error(findError + err);
    return undefined;
  };
});

export const writeBaseJson = async (data: Array<IProduct>): Promise<void> => {

  try {
    await writeFile('./src/app/_data/current.json', JSON.stringify(data));
  }
  catch (err) { console.error(err); }

}

/** Reads content from current.json and tries to return data */
export const readFromJson = async (): Promise<Array<IProduct> | void> => {

  try {
    const data = await readFile('./src/app/_data/current.json', 'utf8');
    return JSON.parse(data);
  }
  catch (err) { return console.error(err); }
}
