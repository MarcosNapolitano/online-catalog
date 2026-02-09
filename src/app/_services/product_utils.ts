'use server'
import crypto from 'crypto'
import mongoose, { Connection } from 'mongoose'
import DatabaseConnects from './db_connect';
import { writeFile } from 'node:fs/promises';
import { readFromCsv } from './json_utils';
import { Task, type IProduct } from '@/app/_data/types';
import { type Response } from '@/app/_data/types';
import { Product } from '@/app/_data/data';
import { TASKS } from '@/app/_data/task';

const saveError = "Could not save Product in database\n\n";
const findError = "Could not find product in database\n\n";
const moveError = "Could not move product\n\n";
const saveImageError = "Could not save product image\n\n";

/** Connects to database and creates products from csv */
export const createProducts = DatabaseConnects(async (): Promise<string> => {

  const productsData = await readFromCsv();
  if (!productsData) return "There is not any csv data";

  const products: Array<IProduct> = [];

  for (let i = 0; i < productsData.length; i += 9) {
    const product: IProduct = new Product;

    product.sku = productsData[i];
    product.name = productsData[i + 1];
    product.price = new mongoose.Types.Decimal128(productsData[i + 2]);
    product.price2 = new mongoose.Types.Decimal128(productsData[i + 3]);
    product.active = productsData[i + 4] == "true" ? true : false;
    product.orden = parseInt(productsData[i + 5]);
    product.sectionOrden = parseInt(productsData[i + 6]);
    product.section = productsData[i + 7];
    product.special = productsData[i + 8] as "" | "oferta" | "novedad";
    product.url = productsData[i];

    products.push(product);
    console.log(`Creating product ${product.sku}`);
  }

  if (await saveProducts(products)) return "Insertion complete!";
  return "Insertion failed"

});

/** Saves an new product from a form to the database */
export const createProduct = async (formData: FormData): Promise<Response> => {

  const product: IProduct = new Product();
  const productSection: string[] = (formData.get("section") as string).split("-");
  const file: File = formData.get("image") as File;
  const buffer: Buffer = Buffer.from(await file.arrayBuffer());
  const url: string = crypto.createHash("sha256").update(buffer).digest("hex");

  product.sku = formData.get("sku") as string;
  product.name = formData.get("name") as string;
  product.price = new mongoose.Types.Decimal128(formData.get("price") as string);
  product.price2 = new mongoose.Types.Decimal128(formData.get("price2") as string);
  product.url = url;
  product.orden = parseInt(formData.get("orden") as string);
  product.section = productSection[0];
  product.sectionOrden = parseInt(productSection[1]);
  product.special = "novedad";
  product.gianfrancoExclusive = formData.get("exclusive") ? true : false;

  // if no order given, set it last
  if (!product.orden)
    product.orden = await findLastOrderOfCategory(product.sectionOrden) || 999;

  if (!await insertProduct(product.sectionOrden, product.orden)) {

    console.error(moveError);
    return { success: false, message: moveError, error: "Error on moveProduct" }
  };

  if (!await saveProduct(product)) {

    console.error(saveError);
    return { success: false, message: saveError, error: "Error on saveProduct" }
  };


  try {
    console.log(`Saving ${product.sku}'s image.`)

    const imageForm = new FormData();
    imageForm.append("file", file);
    imageForm.append("id", url);

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CDN_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CDN_API_TOKEN}`,
        },
        body: imageForm,
      }
    );
  }
  catch (err) {
    console.error(err);
    return { success: false, message: saveImageError, error: "check server log" };
  };

  console.log(`${product.sku} saved successfully!`)
  return { success: true, message: "Producto creado correctamente", error: undefined }
};

/** Save several product to database */
export const saveProducts = DatabaseConnects(async (prods: IProduct[]): Promise<boolean> => {

  console.log("Beginning insertion");
  try { await Product.insertMany(prods); return true }
  catch (err) { console.error(saveError + err); return false };

});

/** Save single product to database */
export const saveProduct = DatabaseConnects(
  async (prod: IProduct): Promise<IProduct | false> => {

    console.log(`${prod.sku} - is being saved on Database`);
    try { return await prod.save() }
    catch (err) {
      console.error(saveError + err);
      return false;
    };
  }
);

export const createTask = async () => {

  const taskID = crypto.randomUUID();
  const token = crypto.randomUUID();

  const Body = JSON.stringify({ id: taskID, token: token });
  const URL = process.env.RAILWAY_PUBLIC_DOMAIN ?
    `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000"

  const Response = await fetch(`${URL}/api/job`,
    {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: Body,
      cache: 'no-store'
    }
  )

  return { taskID, token };
};

const updateTask = async (
  taskID: string,
  message: string,
  progress: number,
  token: string,
  done?: boolean) => {

  const Update: Task = { status: message, progress: progress, token: token };

  if (done) Update.done = true;

  const URL = process.env.RAILWAY_PUBLIC_DOMAIN ?
    `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000"

  const Body = JSON.stringify(Update);
  const Response = await fetch(`${URL}/api/job?id=${taskID}`,
    {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: Body
    }
  )
};

/** Connects to database and creates products from csv */
export const updateProducts = DatabaseConnects(async (
  formData: FormData, taskID: string, token: string): Promise<Response> => {

  const file = formData.get("csv") as File;
  if (!file.size) {
    return {
      success: false,
      message: "Couldn't receive CSV",
      error: "No CSV"
    }
  };

  const productsData = new TextDecoder("utf-8")
    .decode(await file.arrayBuffer())
    .replaceAll("\r", "")
    .replaceAll("\n", ";")
    .split(";")

  //a white space is added at the end
  productsData.pop();

  if (!productsData) return {
    success: false,
    message: "Couldn't read data",
    error: "check server log"
  };

  try {
    for (let i = 0, j = 1; i < productsData.length; i += 3, j++) {

      const Message =
        `Updating ${productsData[i]} ${j} from ${productsData.length / 3}`;

      const progress = (i + 1) * 100 / (productsData.length / 3);
      await Product.updateMany({ sku: productsData[i] },
        {
          $set: {
            price: new mongoose.Types.Decimal128(productsData[i + 1]),
            price2: new mongoose.Types.Decimal128(productsData[i + 2])
          }
        })

      await updateTask(taskID, Message, progress, token)
    }

    await updateTask(taskID, "Done", 100, token, true)
    return {
      success: true,
      message: "Productos actualizados correctamente",
      error: undefined
    }
  }
  catch (err) {
    console.error(err)
    await updateTask(taskID, "Couldn't finish task", -1, token, true)
    return { success: false, message: saveError, error: `${err}` }
  };
});

/** Saves an edited product from a form to the database */
export const editProduct = async (
  formData: FormData,
  originalSku: string,
  originalOrden: number):
  Promise<Response> => {

  const product = await findSingleProduct(originalSku);

  if (!product) return { success: false, message: findError, error: "Error on FindSingleProduct" }

  product.sku = formData.get("sku") as string;
  product.name = formData.get("name") as string;
  product.price = new mongoose.Types.Decimal128(formData.get("price") as string);
  product.price2 = new mongoose.Types.Decimal128(formData.get("price2") as string);
  product.section = formData.get("section") as string;
  product.special = formData.get("special") as "" | "oferta" | "novedad";
  product.gianfrancoExclusive = formData.get("exclusive") ? true : false;

  if (formData.get("sub-sku")) {

    product.subProduct = {
      sku: formData.get("sub-sku") as string,
      price: new mongoose.Types.Decimal128(formData.get("sub-price") as string),
      price2: new mongoose.Types.Decimal128(formData.get("sub-price2") as string),
    }
  }

  if (!await moveProduct(product, parseInt(formData.get('orden') as string))) {

    console.error(moveError);
    return { success: false, message: moveError, error: "Error on moveProduct" }
  };

  const file = formData.get("image") as File;

  if (file.size) {
    try {
      console.log(`Saving ${product.sku}'s image.`)

      const buffer: Buffer = Buffer.from(await file.arrayBuffer());
      const url: string = crypto.createHash("sha256").update(buffer).digest("hex");
      const imageForm = new FormData();

      imageForm.append("file", file);
      imageForm.append("id", url);
      product.url = url;

      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CDN_ACCOUNT_ID}/images/v1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CDN_API_TOKEN}`,
          },
          body: imageForm,
        }
      );
    }
    catch (err) {
      console.error(err);
      return { success: false, message: saveImageError, error: "check server log" };
    };
  }

  if (!await saveProduct(product)) {

    console.error(saveError);
    return { success: false, message: saveError, error: "Error on saveProduct" }
  };

  console.log(`${product.sku} edited successfully!`);
  return { success: true, message: "Producto editado correctamente", error: undefined }
};

/** Find and display all products ordered by section and category */
export const findProducts = DatabaseConnects(async () => {

  try {
    const products = await Product.find({}, { _id: 0, __v: 0 })
      .sort({ sectionOrden: "asc", orden: "asc" }).lean<IProduct[]>();

    for (const product of products) {

      product.price = product.price.toString()
      product.price2 = product.price2.toString()

      if (product.subProduct) {
        product.subProduct.price = product.subProduct.price.toString()
        product.subProduct.price2 = product.subProduct.price2.toString()
      };
    };

    return products;
  }
  catch (err) {
    console.error(findError + err);
    return undefined;
  };
});

/** Find and display all products but only the name and section
since this is used to populate a simple product list*/
export const findProductsSimplified = DatabaseConnects(
  async (): Promise<IProduct[] | undefined> => {
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
  }
);

/** Find products by order, used to insert or move single products in database */
export const findProductbyOrder = DatabaseConnects(
  async (section: string, orden: number): Promise<IProduct[]> => {

    try { return await Product.find({ section: section, orden: { $gte: orden } }).sort({ orden: "asc" }); }
    catch (err) {
      console.error(findError + err);
      return [];
    };
  }
);

/** Find and display a single product based on a given sku */
export const findSingleProduct = DatabaseConnects(async (sku: string): Promise<IProduct | null> => {

  try { return await Product.findOne({ sku: sku }, {}); }
  catch (err) {
    console.error(findError + err);
    return null;
  };
});

/** Find and display a single product based on section and order*/
export const findSingleProductByOrder = DatabaseConnects(
  async (section: string, order: number): Promise<IProduct | null> => {

    try { return await Product.findOne({ section: section, order: order }, {}); }
    catch (err) {
      console.error(findError + err);
      return null;
    };
  }
);

/** Find last product of a section in order to insert after */
export const findLastOrderOfCategory = DatabaseConnects(
  async (sectionOrden: number): Promise<number | null> => {

    try {
      return await Product.countDocuments({ sectionOrden: sectionOrden }) + 1
    }
    catch (err) {
      console.error(findError + err);
      return null;
    };
  }
);

/** Deletes single product from database */
export const findAndDelete = DatabaseConnects(
  async (sku: string): Promise<IProduct | null> => {

    console.log(`${sku} - is being deleted from Database`);
    try { return await Product.findOneAndDelete({ sku: sku }) }
    catch (err) {
      console.error(saveError + err);
      return null;
    };
  }
);

/** Deletes a product from the database and moves the adjacents elements */
export const deleteProduct = async (sku: string): Promise<Response> => {
  try {
    const product = await findAndDelete(sku);

    if (product) await insertProduct(product.sectionOrden, product.orden, true);

    return { success: true, message: "Producto borrado correctamente", error: undefined };
  }
  catch (err) {
    console.error(`There was an error while deleting object: ${sku}`);
    return { success: false, message: "Error while deleting object", error: "Check server log" };
  }
};

/** Toggle active product */
export const toggleProduct = async (sku: string): Promise<true | false> => {
  const product = await findSingleProduct(sku);
  if (!product) return false;

  console.log(`${sku} - is being changed from ${product.active} to ${!product.active}`);
  product.active = !product.active;
  if (!await saveProduct(product)) return false;

  return true

};

/** Used for editing and products, we offset the products depending on the orders given */
export const moveProduct = DatabaseConnects(
  async (product: IProduct, newOrden: number): Promise<false | IProduct> => {

    const currOrden = product.orden;

    if (currOrden === newOrden) return product;
    if (newOrden <= 0) {

      console.log(`${moveError}orden not valid`);
      return false;
    }

    console.log(`${product.sku} is being moved from position ${currOrden} to ${newOrden}`);

    // we add 1 from newOrden up until currOrden
    // or we substract one from currOrden until newOrden
    const orderObject = currOrden > newOrden ?
      { $gte: newOrden, $lt: currOrden } : { $gt: currOrden, $lte: newOrden };

    const orderNumber = currOrden > newOrden ? 1 : -1;

    try {
      await Product.updateMany(
        {
          sectionOrden: product.sectionOrden,
          orden: orderObject
        },
        { $inc: { orden: orderNumber } }
      );
    }
    catch (err) {
      console.error(`Error while moving products, original sku: ${product.sku}\n\n${err}`);
      return false;
    };

    product.orden = newOrden;
    return product;
  }
);

/** Used for inserting and deleting products, 
  * we offset the products from the given order until the end */
export const insertProduct = DatabaseConnects(
  async (section: number, orden: number, deletion?: boolean):
    Promise<false | true> => {

    const orderNumber = deletion ? -1 : 1;

    try {
      await Product.updateMany(
        {
          sectionOrden: section,
          orden: { $gte: orden }
        },
        { $inc: { orden: orderNumber } }
      );
    }
    catch (err) {
      console.error(`Error while moving products.\n\n${err}`);
      return false;
    };
    return true
  }
);
