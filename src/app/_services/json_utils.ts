import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { type IProduct } from '@/app/_data/types';
import { unstable_cacheTag as cacheTag } from 'next/cache';

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

export const readFromCsv = async (): Promise<Array<string> | void> => {
  'use server'
  try {
    const res: Array<string> = await readFile("./src/app/_data/catalogo_web.csv", "utf-8").then((data) => {
      data = data.replaceAll("\r", "");
      data = data.replaceAll("\n", ";")
      return data.split(";");
    });
    //a white space is added at the end
    res.pop()
    return res;
  }
  catch (err) { return console.error("could not read products from csv!" + err) };
};

export const readData = async (): Promise<IProduct[]> => {

  //We get the data from the current JSON 
  const products = await readFromJson();
  if (!products) return [];

  console.log("Json Read!");
  return products;
};
