import mongoose from "mongoose"
import { Product } from "@/app/_data/data"
import { IProduct } from "@/app/_data/types"
import { createProducts } from "@/app/_services/product_utils"

export async function GET() {
  const products = await createProducts();
  return Response.json(products)
}
