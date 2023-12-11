declare module 'convert-csv-to-json' {
  export function generateJsonFileFromCsv<T = unknown>(
    inputFilePath: string,
    outputFilePath: string
  ): T;

  export function getJsonFromCsv<T = unknown>(inputFilePath: string): T;

  export function fieldDelimiter(
    delimiter: string
  ): typeof import('convert-csv-to-json');
}
