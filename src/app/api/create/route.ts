import mongoose from "mongoose"
import { Product } from "@/app/_data/data"
import { IProduct } from "@/app/_data/types"
import { createProducts } from "@/app/_services/product_utils"

export async function GET() {
  const products = await createProducts();
  // const URL = "https://serpapi.com/search.json?engine=google_images&";
  // const KEY = `?key=${process.env.GOOGLE_API_KEY}`
  //
  // const products = await fetch(`${URL}&q=felfort&api_key=${process.env.SERP_KEY}&num=1&google_domain=google.com&hl=es&gl=ar`)
  // const data = await products.json()
  return Response.json('done')
}
