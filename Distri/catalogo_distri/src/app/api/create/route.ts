import mongoose from "mongoose"
import { Product } from "@/app/_data/data"
import { IProduct } from "@/app/_data/types"
import { saveProducts } from "@/app/_services/product_utils"

export async function GET() {
 
  // const products = await createProducts();

  // try{
  //
  //   await updateManyProducts();
  //
  // }
  //
  // catch(err) { console.error(err); }
  return Response.json("done" )
}
