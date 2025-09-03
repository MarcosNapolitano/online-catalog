import mongoose from "mongoose"
import { Product } from "@/app/_data/data"
import { IProduct } from "@/app/_data/types"
import DatabaseConnects from "@/app/_services/db_connect"

const findProductsSimplified = DatabaseConnects(async () => {
  try {
    return await Product.find({}, {
      special: 1,
      _id: 0
    }).sort({ sectionOrden: "asc", orden: "asc" })
      .lean();
  }
  catch (err) {
    console.error(err);
    return undefined
  };
});
 
export async function GET() {
 
  const products = await findProductsSimplified();
  return Response.json({ products })
}
