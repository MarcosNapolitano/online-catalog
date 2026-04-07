"use server"

import 'pdf-parse/worker'
import { PDFParse } from "pdf-parse"
import databaseConnects from './db_connect';
import { type Response, type IPriceList } from '@/app/_data/types';
import { PriceList } from '@/app/_data/data';

export const updateList = async (pdf: File, listId: 1 | 2): Promise<Response> => {

  let text;

  try {
    const arrayBuffer = await pdf.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const parser = new PDFParse(buffer)
    const data = await parser.getText();
    text = data.text;
    await parser.destroy();
  }
  catch (err) {
    console.error(err)
    return { success: false, message: "Error while parsing PDF", error: "Check Server Log" };
  };

  const dateReg = /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/g;
  const lineNumbers = /^\d$\s/g;
  const companiesReg = /\d{5} .*/g;
  const compLineBreak = /^[A-ZÑ\s]+$/gm;
  const pageLineReg = /--\s*\d{1,2}\s*of\s*\d{1,2}\s*--/g;
  const newLineReg = /^([^;\n]+)\n(?=[^;\n]*;)/gm
  const unitReg = /^.*#.*$\n/gm

  text = text.replaceAll("*", "")
  text = text.replaceAll("DESCRIPCION IMPORTE", "")
  text = text.replaceAll("Padre Elizalde 543. Ciudadela", "")
  text = text.replaceAll(/Lista de Precios \d{2} - \d{2}/gm, "")
  text = text.replaceAll("Proviencia de Buenos Aires", "")
  text = text.replaceAll("E-mail:distribuidoradeloeste@hotmail.com", "")
  text = text.replaceAll("Tel/Fax:4582-5446 /WhatsApp 15 6679-5149", "")
  text = text.replaceAll(dateReg, "")
  text = text.replaceAll(lineNumbers, "")
  text = text.replaceAll(companiesReg, "")
  text = text.replaceAll(pageLineReg, "")
  text = text.replaceAll(compLineBreak, "")
  text = text.replaceAll(" $", ";")
  text = text.replaceAll(newLineReg, "$1 ")
  text = text.replaceAll(unitReg, "")
  text = text.replaceAll("  ", " ")
  // number only on new lines
  text = text.replaceAll(/\n\d\n/g, "\n")
  text = text.replaceAll('PADRES. ', "")
  text = text.replaceAll('\n0 ', "0\n")

  try { await saveList(text, listId); }
  catch (err) {
    console.error(err);
    return { success: false, message: "Error while saving List", error: "Check Server Log" };
  };

  return { success: true, message: "PDF parsed and saved", error: undefined };

};

const saveList = databaseConnects(
  async (newList: string, listId: 1 | 2): Promise<true | null> => {

    if (listId < 1 || listId > 2)
      return null;

    try {
      const list = await PriceList.findOne({ listId: listId }, {});
      list.old = list.new;
      list.new = newList;
      await list.save();
    }
    catch (err) {
      console.error(err);
      return null;
    };

    return true;
  });

export const getList = databaseConnects(
  async (listId: 1 | 2): Promise<IPriceList | null> => {

    if (listId < 1 || listId > 2)
      return null;

    try {
      return await PriceList.findOne({ listId: listId }, {});
    }
    catch (err) {
      console.error(err);
      return null;
    };
  })

