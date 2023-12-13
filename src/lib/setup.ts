import './init-env';
import { db } from '@/db/init';
import * as dotenv from 'dotenv';
import { drugs } from '@/db/schema';
import convertCsv from 'csvtojson/v2';
import path from 'path';
dotenv.config({
  path: path.resolve(import.meta.dir, '../../', '.env'),
});

function readCsvFile(filePath: string) {
  return convertCsv({ delimiter: ',' }).fromFile(filePath);
}

async function loadDataToDb<T extends Record<string, unknown>>(option: {
  filePath: string;
  batchSize?: number;
  mapFn: (data: Record<string, unknown>) => T;
  injectData: (data: Array<T>) => Promise<void>;
}) {
  const { filePath, injectData, mapFn, batchSize = 500 } = option;
  const dataSet = (await readCsvFile(filePath)) as Array<
    Record<string, string>
  >;

  const totalBatchCount = Math.round(dataSet.length / batchSize);
  let current = 0;

  while (current < totalBatchCount) {
    const startOffset = current * batchSize;
    const endOffset = startOffset + batchSize;
    const batchData = dataSet.slice(startOffset, endOffset);
    await injectData(batchData.map(mapFn));
    current++;
  }
  process.exit(0);
}

loadDataToDb({
  filePath: path.join(
    process.cwd(),
    '../ml/new/',
    './drugs_side_effects_drugs_com.csv'
  ),
  mapFn(data) {
    return {
      name: data['drug_name'] as string,
      condition: data['medical_condition'] as string,
      sideEffect: data['side_effects'] as string,
      drugUrl: data['drug_link'] as string,
      medicalConditionUrl: data['medical_condition_url'] as string | undefined,
      effective: (+(data['rating'] as string | number)).toPrecision(3) || null,
      decription: data['medical_condition_description'] as string | undefined,
      relatedDrugs: (data['related_drugs'] as string | undefined)
        ?.split('|')
        .map((item) => {
          const [drugName, link] = item
            .split(/(?<!https?):/, 2)
            .map((value) => value.trim());
          return { drugName, link };
        }),
    };
  },
  injectData: async (data) => {
    console.log(data.slice(0, 1));
    await db.insert(drugs).values(data.slice(0, 1));
    throw 0;
  },
  batchSize: 1000,
})
  .then(() => {
    console.log('completed');
  })
  .catch((e) => {
    console.log('An error occurs');
    console.log(e);
  });

// loadDataToDb({
//   filePath: path.join(process.cwd(), '../ml/new/', './medicine_dataset.csv'),
//   mapFn(data) {
//     const keys = Object.keys(data);
//     const substitutes = keys
//       .filter((key) => /substitute/i.test(key) && data[key])
//       .map((key) => data[key]) as Array<string>;

//     const effects = keys
//       .filter((key) => /sideEffect/i.test(key) && data[key])
//       .map((key) => data[key]) as Array<string>;
//     const uses = keys
//       .filter((key) => /use/i.test(key) && data[key])
//       .map((key) => data[key]) as Array<string>;
//     return {
//       name: data['name'] as string,
//       substitutes,
//       effects,
//       uses,
//       habitForm: data['Habit Forming'] as string,
//       therapeuticClass: data['Therapeutic Class'] as string | undefined,
//     };
//   },
//   injectData: async (data) => {
//     await db.insert(drugs).values(data);
//   },
//   batchSize: 1000,
// })
//   .then(() => {
//     console.log('completed');
//   })
//   .catch((e) => {
//     console.log('An error occurs');
//     console.log(e);
//   });
