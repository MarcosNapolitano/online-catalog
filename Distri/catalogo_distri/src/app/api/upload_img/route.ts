import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {

    //to do 
    //this is actually the csv version, testing on this anyway
    const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });

    return new Promise((resolve, reject) => {
        form.parse(req as any, async (err, fields, files) => {
            if (err) {
                console.error(err);
                reject(NextResponse.json({ success: false }));
                return;
            }

            if (files.file){
                const file = files.file[0] as formidable.File;
                const oldPath = file.filepath;
                const newFileName = 'catalogo_web' + file.originalFilename?.substring(file.originalFilename.lastIndexOf('.')) || '';
                const newPath = `@/app/src/_data/${newFileName}`;

                try {
                    await fs.rename(oldPath, newPath);
                    resolve(NextResponse.json({ success: true, filename: newFileName }));
                } catch (error) {
                    console.error('Error renombrando archivo:', error);
                    reject(NextResponse.json({ success: false }));
                }
            }
        });
    });
}

