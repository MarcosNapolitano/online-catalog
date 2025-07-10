import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document{

    sku: string;
    name: string;
    url: string;
    price: mongoose.Types.Decimal128;
    section: string;
    orden: number;
    active: boolean;

}

//product model
export const productSchema: Schema = new Schema<IProduct>({

    sku: { type: String, required: true},
    name: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    section: { type: String, required: true },
    orden: { type: Number, required: true },
    active: { type: Boolean, required: true }

});

export const Product = mongoose.model<IProduct>("Products", productSchema);

await new Product({sku:"ARC0001", 
            name:"Producto de Prueba x8u.",
            url:"https://drive.google.com/file/d/1Dd3gB71W5TCbyZDmNdXrHC1vqjoRdjbu/view?usp=sharing",
            price:25000.54,
            section:"Almacen",
            orden:1,
            active:true}).save().catch((err: Error) => console.log(err));

await new Product({sku:"ARC0002", 
            name:"Producto de Prueba2 x8u.",
            url:"https://drive.google.com/file/d/1Dd3gB71W5TCbyZDmNdXrHC1vqjoRdjbu/view?usp=sharing",
            price:30000.54,
            section:"Almacen",
            orden:2,
            active:true}).save().catch((err: Error) => console.log(err));
