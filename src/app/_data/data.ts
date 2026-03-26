import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, IUser, IPriceList } from './types';
import { type } from 'node:os';

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
  sectionOrdenGianfranco: { type: Number, required: true },
  special: { type: String, default: "" },
  subProduct: { type: Object, default: undefined },
  gianfrancoExclusive: { type: Boolean, default: false },
  isCombo: { type: Boolean, default: false },
  imgUrls: { type: [String] },
  units: { type: Number },
  extName: { type: String }

});

export const userSchema: Schema = new Schema<IUser>({

  name: { type: String, required: true },
  password: { type: String, required: true }

})

export const listSchema: Schema = new Schema<IPriceList>({
  listId: { type: Number },
  old: { type: String },
  new: { type: String },
})

//prevents overwriting scheme
export const Product = mongoose.models.Products || mongoose.model<IProduct>("Products", productSchema);
export const User = mongoose.models.Users || mongoose.model<IUser>("Users", userSchema);
export const PriceList = mongoose.models.PriceList || mongoose.model<IPriceList>("PriceList", listSchema);
