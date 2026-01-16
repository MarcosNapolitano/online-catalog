import mongoose, { Document } from 'mongoose';
import { ReactNode } from 'react';

export interface JsonWebToken {
  userName: string
  [key: string]: string | number | boolean | null | undefined
}

export interface Task{
  status: string;
  progress: number;
  token: string;
  done?: true;
}

interface Product {
  sku: string,
  name: string,
  url: string,
  price: string | mongoose.Types.Decimal128,
  price2: string | mongoose.Types.Decimal128,
  section: string,
  orden: number,
  active: boolean,
  sectionOrden: number,
  special: "" | "oferta" | "novedad",
  subProduct?: {
    sku: string,
    price: string | mongoose.Types.Decimal128,
    price2: string | mongoose.Types.Decimal128,
  }
};

interface User {
  name: string;
  password: string;
}

export type IProduct = Product & Document;
export type IUser = User & Document;

export interface Response {
  success: true | false;
  message: string;
  error: undefined | string;
}

export interface CsvForm {
  file: File;
}

export interface IDeslogeo {
  action: () => void;
}

export interface ProductForm {
  sku: string;
  name: string;
  price: string;
  price2: string;
  section: string;
  orden: number;
  special: string;
  subProduct?: {
    sku: string,
    price: string,
    price2: string,
  }
}

export interface IProductComp {
  id: string,
  title: string,
  section: string,
  price: string,
  url: { url: string, oferta: string, novedad: string},
  active: boolean,
  special: "oferta" | "novedad" | "",
  price2?: string
}

export interface IEmptyProduct {
  id: string;
  section?: string;
  url: string;
}

export interface ISection {
  id: string;
  name?: string;
  children?: ReactNode;
  user?: string;
}

export interface IRow {
  id: string;
  children?: ReactNode;
}

export interface IColumn {
  id: string;
  section?: string;
  children?: ReactNode;
}

export interface SearchComp {
  products: IProduct[] | undefined;
  backAction: (sku: string) => Promise<true | false>;
}

export interface MiscComp {
  refreshCatalog: () => Promise<Response>;
}

export interface ResultList {
  products: IProduct[] | void;
  filter: string;
  category?: string;
  backAction: (sku: string) => Promise<true | false>;
}

export interface Result {
  sku: string;
  active: boolean | undefined;
  name: string;
  orden: number;
  backAction: (sku: string) => Promise<true | false>;
}
