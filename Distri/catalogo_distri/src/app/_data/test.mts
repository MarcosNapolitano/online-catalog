#!/usr/bin/env node

import mongoose from "mongoose"
import { Product } from "./data.ts"
import * as types from "./types.ts"
import DatabaseConnects from "../_services/db_connect.ts"

const findProductsSimplified = DatabaseConnects(async () => {
  try {
    return await mongoose.models.Product.find({}, {
      sku: 1,
      _id: 0
    }).sort({ sectionOrden: "asc", orden: "asc" })
      .lean();
  }
  catch (err) {
    console.error(err);
    return undefined
  };
});

console.log(findProductsSimplified())
