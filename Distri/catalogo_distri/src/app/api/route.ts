import { IProduct } from "../_data/data";
import { findProducts, writeBaseJson } from "../_data/utils";

export async function GET() {

    try {
        const data: Array<IProduct> | undefined = await findProducts()
        if (data) {
            
            try { await writeBaseJson(data) }
            catch(err) { console.error("couldn't write file: " + err); };

            return Response.json("done");
        }else{ return Response.json("no data received"); };

    }catch(err) { console.log("couldn't retrieve data: " + err) };
}
