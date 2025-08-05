import { IProduct } from "@/app/_data/data";
import { writeBaseJson, findProducts } from "@/app/_data/utils";

export async function GET() {

    const data: Array<IProduct> | undefined = await findProducts()
    if (data) {

        await writeBaseJson(data);
        return Response.json(data);

    }else{ return Response.json("no data received"); };
}
