import './db_connect.ts';
import { Product, IProduct } from './data';
import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';

//strings for error handling
const saveError = "Could not save Product in database\n\n";
const findError = "Could not find Product in database\n\n";

export const createProduct = async (product: IProduct) => {

    //creates product
    const newProduct = new Product(product);

    //saves
    const result = await newProduct.save()
    .catch(err => {
        return console.error(saveError + err);
    });

    if(result) return console.log("Product Saved");
    else return console.error(saveError);

};

export const findProducts = async () => {

    //find and display all products
    try{ return await Product.find({}); }
    catch(err) { 
        console.error(findError + err );
        return undefined;
    };
};

export const writeBaseJson = async (data: Array<IProduct>) => {

    try {
        await writeFile('./src/app/_data/current.json', JSON.stringify(data));
    }
    catch (err) { console.error(err); }

}

export const readFromJson = async () => {

    try{
        const data = await readFile('./src/app/_data/current.json', 'utf8');
        console.log(JSON.parse(data));
    }
    catch (err) { console.error(err); }
}
