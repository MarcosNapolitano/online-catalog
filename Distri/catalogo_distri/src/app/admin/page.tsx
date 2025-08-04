import { Search } from "../_components/search"
import { IProduct } from "../_data/data";
import { findProductsSimplified } from "../_data/utils";

const data: IProduct | undefined = await findProductsSimplified();

export default async function Home() {

    return (
        <div>
            <h1>Wellcome to the admin panel</h1>
            <Search data={ data } />
        </div>
    );
}
