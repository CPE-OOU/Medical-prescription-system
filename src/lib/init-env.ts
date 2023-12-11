import * as dotenv from 'dotenv';

import path from 'path';
console.log(path.resolve(__dirname, '../../', '.env'));
dotenv.config({
  path: path.resolve(__dirname, '../../', '.env'),
});
