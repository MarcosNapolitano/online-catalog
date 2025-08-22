'use server'

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
export const createProducts = DatabaseConnects(async (): Promise<string> => {

  const data = await readFromCsv();
  if (!data) return "There is not any csv data";

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
    return "insertion complete!";
  }

  catch (err) { return `could not insert products! ${err}` };
});

/** Save sigle product to database */
export const saveProduct = DatabaseConnects(async (prod: IProduct): Promise<IProduct | false> => {

  try { return await prod.save() }
  catch (err) {
    console.error(saveError + err);
    return false;
  };

});

/** Save several product to database */
export const saveProducts = DatabaseConnects(async (prods: IProduct[]) => {

  try { await Product.insertMany(prods) }
  catch (err) { console.error(saveError + err) };

});

/** Find and display all products ordered by section and category */
export const findProducts = DatabaseConnects(async () => {

  try { return await Product.find({}).sort({ sectionOrden: "asc" }).lean<IProduct[]>(); }
  catch (err) {
    console.error(findError + err);
    return undefined;
  };
});

/** Find and display all products but only the name and section
since this is used to populate a simple product list*/
export const findProductsSimplified = DatabaseConnects(async (): Promise<IProduct[] | undefined> => {

  try {
    return await Product.find({}, {
      name: 1,
      section: 1,
      sku: 1,
      orden: 1,
      active: 1,
      _id: 0
    })
      .lean<IProduct[]>();
  }
  catch (err) { 
    console.error(findError + err);
    return undefined
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
export const findSingleProduct = DatabaseConnects(async (sku: string): Promise<IProduct | void | null> => {

  try { return await Product.findOne({ sku }, {}); }
  catch (err) { return console.error(findError + err); };
});

/** Toggle active product */
export const toggleProduct = async (sku: string): Promise<true | false> => {
  const product = await findSingleProduct(sku);
  if (!product) return false;

  product.active = !product.active;
  if (!await saveProduct(product)) return false;

  return true

};


export interface Response {
  success: true | false;
  message: string;
  error: undefined | string;
}


/** Saves an new product from a form to the database */
export const createProduct = async (formData: FormData): Promise<Response> => {

  // const product = new Product();
  // product.sku = formData.body.sku;
  // product.precio1 = formData.body.price;
  // product.precio2 = formData.body.price2;
  // product.section = formData.body.section;
  // 
  // to do:
  // FormData.body.imagen // writeFile con node! acordarse de ponerle sku + .webp
  //
  // const orden = moveProduct(product.sku, originalOrden, formData.body.orden, product.section)
  // if (orden) product.orden = formData.body.orden;
  // else return false
  //
  // return true;
};

/** Saves an edited product from a form to the database */
export const editProduct = async (formData: FormData, originalSku: string, originalOrden: number): Promise<Response> => {

  return { success: true, message: "ok", error: undefined }
  // const product = await findSingleProduct(originalSku);
  // product.sku = formData.get('sku');
  // product.precio1 = formData.get('price');
  // product.precio2 = formData.get('price2');
  // product.section = formData.get('section');
  // 
  // to do:
  // FormData.body.imagen // writeFile con node! acordarse de ponerle sku + .webp
  //
  // const orden = moveProduct(product.sku, originalOrden, formData.get('orden'), product.section)
  // if (orden) product.orden = formData.get('orden')  
  // // else return false
  //
  // return true;
};

/** Deletes a product from the database */
export const deleteProduct = async (sku: string) => {

  // const product = await findSingleProduct(sku);
  //
  // product.delete() //no se si es asi
  //
  // const products = await findProductbyOrder(section, product.orden + 1 );
  //
  // for (let i = product.orden + 1; i < products.length; i++) {
  //
  //   products[i].orden--;
  //   if (!await saveProduct(product)) return console.error(`could not finish operation, stopped on sku: ${products[i].sku}`);
  // }
  //
  // return true;
};

/** Used for editing and inserting products, we offset the products depending on the orders given */
export const moveProduct = async (sku: string, currOrden: number, newOrden: number, section: string): Promise<true | void> => {

  if (currOrden === newOrden) return;
  if (newOrden <= 0) return console.log("orden not valid");

  const product = await findSingleProduct(sku);
  if (!product) return console.log("product not found!");

  if (currOrden > newOrden) {
    //  we add 1 from newOrden up until currOrden -1
    const products = await findProductbyOrder(section, newOrden);

    for (let i = newOrden; i < currOrden; i++) {

      products[i].orden++;
      if (!await saveProduct(product)) return console.error(`could not finish operation, stopped on sku: ${products[i].sku}`);
    }
  }
  else {
    // we substract 1 from currOrden +1 up untill newOrden
    const products = await findProductbyOrder(section, currOrden + 1);

    for (let i = currOrden + 1; i <= newOrden; i++) {

      products[i].orden--;
      if (!await saveProduct(product)) return console.error(`could not finish operation, stopped on sku: ${products[i].sku}`);
    }
  }

  product.orden = newOrden;
  if (!await saveProduct(product)) return console.error("could not move target object");

  return true;

};

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
