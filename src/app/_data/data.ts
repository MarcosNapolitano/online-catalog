import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, IUser } from './types';

//product model
export const productSchema: Schema = new Schema<IProduct>({

    sku: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    price2: { type: Schema.Types.Decimal128, required: true },
    section: { type: String, required: true },
    orden: { type: Number, required: true },
    active: { type: Boolean, default: true },
    sectionOrden: { type: Number, required: true },
    special: { type: String, default: "" },
    subProduct: { type: Object, default: undefined },
    gianfrancoExclusive: { type: Boolean, default: false }
});

export const userSchema: Schema = new Schema<IUser>({

  name: { type: String, required: true },
  password: { type: String, required: true }

})

//prevents overwriting scheme
export const Product = mongoose.models.Products || mongoose.model<IProduct>("Products", productSchema);
export const User = mongoose.models.Users || mongoose.model<IProduct>("Users", userSchema);
