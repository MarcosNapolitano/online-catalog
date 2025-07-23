import { createProduct } from "../../_data/utils";

export async function GET() {

    try { return Response.json(await createProduct()); }
    catch (err) { return Response.json("Something Went Wrong!" + err ) };
}
