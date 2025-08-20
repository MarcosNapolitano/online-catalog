import { createProduct } from "@/app/_data/utils";

export async function GET() {

    return Response.json(await createProduct());
}
