import formidable from 'formidable';
import { Readable } from 'stream';
import type { NextRequest } from 'next/server';

export async function parseForm(req: NextRequest): Promise<[any, any]> {
  return new Promise(async (resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });

    const stream = Readable.fromWeb(req.body as any);
    const nodeReq: any = stream;
    nodeReq.headers = Object.fromEntries(req.headers.entries());

    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve([fields, files]);
    });
  });
}
