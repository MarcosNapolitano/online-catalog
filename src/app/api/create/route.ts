import { createProducts } from "@/app/_services/product_utils"

export async function GET() {
  // to do: crear el campo nuevo en productos que tengan subproduct
  // findAll({ subProduct: { $exists: true }});
  // luego copiar sus skus, sacar los nombre y agregarles extName
  const products = await createProducts();
  return Response.json(products);
}
