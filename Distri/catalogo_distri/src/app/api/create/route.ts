import { createProducts } from "@/app/_data/utils";

export async function GET() {

    return Response.json(await createProducts());
}
