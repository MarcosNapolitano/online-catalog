import { IProduct } from "../../_data/data";
import { createProduct } from "../../_data/utils";

export async function GET() {

    const data: Array<IProduct> | undefined = await findProducts()
    if (data) {

        await writeBaseJson(data);
        return Response.json("done");

    }else{ return Response.json("no data received"); };

}
