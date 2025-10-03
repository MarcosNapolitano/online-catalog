import mongoose, { Document }  from 'mongoose';
import { ReactNode } from 'react';

export interface JsonWebToken {
  userName: string
  [key: string]: string | number | boolean | null | undefined
}

interface Product {
    sku: string,
    name: string,
    url: string,
    price: mongoose.Types.Decimal128,
    price2: mongoose.Types.Decimal128,
    section: string,
    orden: number,
    active: boolean,
    sectionOrden: number,
    special: "" | "oferta" | "novedad"
};

interface User{
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

export interface IDeslogeo{
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
}

export interface IProductComp {
  id: string,
  title: string,
  section: string,
  price: string,
  url: string,
  active: boolean,
  special: "oferta" | "novedad" | ""
}

export interface IEmptyProduct{
  id: string;
  section?: string;
}

export interface ISection{
  id: string;
  name?: string;
  children?: ReactNode;
  user?: string
}

export interface IRow{
  id: string;
  children?: ReactNode;
}

export interface IColumn{
  id: string;
  section?: string;
  children?: ReactNode;
}

export interface SearchComp {
  products: IProduct[] | undefined;
  backAction: (sku: string) => Promise<true | false>;
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
