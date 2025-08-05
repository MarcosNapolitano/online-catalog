import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document{

    sku: string;
    name: string;
    url: string;
    price: mongoose.Types.Decimal128;
    price2: mongoose.Types.Decimal128;
    section: string;
    orden: number;
    active: boolean;
    sectionOrden: number;

}

//product model
export const productSchema: Schema = new Schema<IProduct>({

    sku: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    price2: { type: Schema.Types.Decimal128, required: true },
    section: { type: String, required: true },
    orden: { type: Number, required: true },
    active: { type: Boolean, required: true },
    sectionOrden: { type: Number, required: true }

});

//prevents overwriting scheme
export const Product = mongoose.models.Products || mongoose.model<IProduct>("Products", productSchema);
