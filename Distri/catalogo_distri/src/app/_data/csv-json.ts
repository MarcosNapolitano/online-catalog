#!/usr/bin/env -S node --experimental-strip-types
import { readFile } from 'node:fs/promises'

export const readFromCsv = async (): Promise < Array<string> | void > => {

    try {
        const res: Array<string> = await readFile("./src/app/_data/catalogo_web.csv", "utf-8").then((data) => {

            data = data.replaceAll("\r", "");
            //to do
            //this can cause an error, sometimes csv's are separated with ,
            data = data.replaceAll("\n", ";")
            return data.split(";");
        });
        
        //a white space is added at the end
        res.pop()
        
        return res;
    }

    catch (err) { return console.error("could not read products from csv!" + err) };

};
