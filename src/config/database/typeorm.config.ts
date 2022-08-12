import { ConnectionOptions } from 'typeorm';
import DbConfig from './configuration';
import * as dotenv from 'dotenv';
dotenv.config(); // very very important!!
const typeormConfig = DbConfig() as ConnectionOptions;
export default typeormConfig;
