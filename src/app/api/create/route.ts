import { createProducts } from "@/app/_services/product_utils"

export async function GET() {
  const products = await createProducts();
  return Response.json('done')
}
