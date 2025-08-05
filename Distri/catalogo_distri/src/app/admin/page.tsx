import { Search } from "@/app/_components/search"
import { IProduct } from "@/app/_data/data";
import { findProductsSimplified } from "@/app/_data/utils";

const data: IProduct[] | undefined = await findProductsSimplified();

export default async function Home() {

    return (
        <div>
            <h1>Wellcome to the admin panel</h1>
            <Search data={ data } />
        </div>
    );
}
