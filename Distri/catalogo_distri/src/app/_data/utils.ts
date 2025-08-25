'use server'

import { IProduct, Product } from './data';
import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';
import mongoose, { Connection } from 'mongoose'
import { readFromCsv } from './csv-json';

//strings for error handling
const saveError = "Could not save Product in database\n\n";
const findError = "Could not find product in database\n\n";
const moveError = "Could not move product\n\n";
const saveImageError = "Could not save product image\n\n";

export interface Response {
  success: true | false;
  message: string;
  error: undefined | string;
}

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

  const productsData = await readFromCsv();
  if (!productsData) return "There is not any csv data";

  const products: Array<IProduct> = [];

  for (let i = 0; i < productsData.length; i += 8) {
    const product: IProduct = new Product;

    product.sku = productsData[i];
    product.name = productsData[i + 1];
    product.price = new mongoose.Types.Decimal128(productsData[i + 2]);
    product.price2 = new mongoose.Types.Decimal128(productsData[i + 3]);
    product.active = productsData[i + 4] == "true" ? true : false;
    product.orden = parseInt(productsData[i + 5]);
    product.section = productsData[i + 6];
    product.url = productsData[i];
    product.sectionOrden = parseInt(productsData[i + 7]);

    products.push(product);

  }

  try {

    await Product.insertMany(products);
    return "insertion complete!";
  }

  catch (err) { return `${saveError} ${err}` };
});

/** Save sigle product to database */
export const saveProduct = DatabaseConnects(async (prod: IProduct): Promise<IProduct | false> => {

  console.log(prod.sku);
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

  try { return await Product.find({}).sort({ sectionOrden: "asc", orden: "asc" }).lean<IProduct[]>(); }
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
    }).sort({ sectionOrden: "asc", orden: "asc" })
      .lean<IProduct[]>();
  }
  catch (err) {
    console.error(findError + err);
    return undefined
  };
});

/** Find products by order, used to insert or move single products in database */
export const findProductbyOrder = DatabaseConnects(async (section: string, orden: number): Promise<IProduct[]> => {

  try { return await Product.find({ section: section, orden: { $gte: orden } }).sort({ orden: "asc" }); }
  catch (err) {
    console.error(findError + err);
    return [];
  };


});

/** Find and display a single product based on a given sku */
export const findSingleProduct = DatabaseConnects(async (sku: string): Promise<IProduct | null> => {

  try { return await Product.findOne({ sku: sku }, {}); }
  catch (err) {
    console.error(findError + err);
    return null;
  };
});

/** Find and display a single product based on section and order*/
export const findSingleProductByOrder = DatabaseConnects(async (section: string, order: number): Promise<IProduct | null> => {

  try { return await Product.findOne({ section: section, order: order }, {}); }
  catch (err) {
    console.error(findError + err);
    return null;
  };
});

/** Toggle active product */
export const toggleProduct = async (sku: string): Promise<true | false> => {
  const product = await findSingleProduct(sku);
  if (!product) return false;

  product.active = !product.active;
  if (!await saveProduct(product)) return false;

  return true

};

/** Saves an new product from a form to the database */
export const createProduct = async (formData: FormData): Promise<Response> => {

  const product: IProduct = new Product();
  const productSection = (formData.get("section") as string).split("-")

  product.sku = formData.get("sku") as string;
  product.name = formData.get("name") as string;
  product.price = new mongoose.Types.Decimal128(formData.get("price") as string);
  product.price2 = new mongoose.Types.Decimal128(formData.get("price2") as string);
  product.url = formData.get("sku") as string;
  product.section = productSection[0];
  product.sectionOrden = parseInt(productSection[1]);

  if (!await insertProduct(product.section, product.orden)) {

    console.error(moveError);
    return { success: false, message: moveError, error: "Error on moveProduct" }
  };

  if (!await saveProduct(product)) {

    console.error(saveError);
    return { success: false, message: saveError, error: "Error on saveProduct" }
  };

  const file = formData.get("image") as File;

  try {
    const data = await file.arrayBuffer();
    await writeFile(`./public/img/${product.sku}.webp`, Buffer.from(data));
  }
  catch (err) {
    console.error(err);
    return { success: false, message: saveImageError, error: "check server log" };
  };

  return { success: true, message: "Producto creado correctamente", error: undefined }
};

/** Saves an edited product from a form to the database */
export const editProduct = async (formData: FormData, originalSku: string, originalOrden: number): Promise<Response> => {

  const product = await findSingleProduct(originalSku);

  if (!product) return { success: false, message: findError, error: "Error on FindSingleProduct" }

  product.sku = formData.get("sku") as string;
  product.name = formData.get("name") as string;
  product.price = new mongoose.Types.Decimal128(formData.get("price") as string);
  product.price2 = new mongoose.Types.Decimal128(formData.get("price2") as string);
  product.section = formData.get("section") as string;
  product.special = formData.get("special") as "" | "oferta" | "novedad";

  if (!await moveProduct(product, parseInt(formData.get('orden') as string))) {

    console.error(moveError);
    return { success: false, message: moveError, error: "Error on moveProduct" }
  };

  if (!await saveProduct(product)) {

    console.error(saveError);
    return { success: false, message: saveError, error: "Error on saveProduct" }
  };

  const file = formData.get("image") as File;

  if (file){

    try {
      const data = await file.arrayBuffer();
      await writeFile(`./public/img/${product.sku}.webp`, Buffer.from(data));
    }
    catch (err) {
      console.error(err);
      return { success: false, message: saveImageError, error: "check server log" };
    };

  }

  return { success: true, message: "Producto editado correctamente", error: undefined }
};

/** Deletes a product from the database */
export const deleteProduct = async (sku: string): Promise<Response> => {
  try {
    const product: IProduct | null = await Product.findOneAndDelete({ sku: sku }, { projection: { _id: 0, section: 1, orden: 1 } });

    if (product) await insertProduct(product.section, product.orden, true);

    return { success: true, message: "Producto borrado correctamente", error: undefined };
  }
  catch (err) {
    console.error(`There was an error while deleting object: ${sku}`);
    return { success: false, message: "Error while deleting object", error: "Check server log" };
  }
};

/** Used for editing and products, we offset the products depending on the orders given */
export const moveProduct = async (product: IProduct, newOrden: number): Promise<false | IProduct> => {

  const currOrden = product.orden;

  if (currOrden === newOrden) return product;
  if (newOrden <= 0) {

    console.log(`${moveError}orden not valid`);
    return false;
  }

  if (currOrden > newOrden) {
    // we add 1 from newOrden - 1 (since now these are indexes) up until currOrden -1
    const products = await findProductbyOrder(product.section, 1);

    for (let i = newOrden - 1; i < currOrden - 1 && i < products.length; i++) {

      products[i].orden += 1;
      if (!await saveProduct(products[i])) {

        console.error(`${moveError}could not finish operation, stopped on sku: ${products[i].sku}`);
        return false
      }
    }
  }
  else {
    // we substract 1 from currOrden up untill newOrden - 1
    const products = await findProductbyOrder(product.section, 1);

    for (let i = currOrden; i <= newOrden - 1 && i < products.length; i++) {

      products[i].orden -= 1;
      if (!await saveProduct(products[i])) {
        console.error(`${moveError}could not finish operation, stopped on sku: ${products[i].sku}`);
        return false
      }
    }
  }
  product.orden = newOrden;
  return product;
};

/** Used for inserting and deleteing products, we offset the products from the given order until the end */
export const insertProduct = async (section: string, orden: number, deletion?: boolean): Promise<false | true> => {

  const products = await findProductbyOrder(section, 1);

  for (let i = orden - 1; i < products.length; i++) {

    if (deletion) products[i].orden -= 1;
    else products[i].orden += 1;

    if (!await saveProduct(products[i])) {

      console.error(`${moveError}could not finish operation, stopped on sku: ${products[i].sku}`);
      return false
    }
  }
  return true
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
