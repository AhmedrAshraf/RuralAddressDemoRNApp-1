// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { RuralAddress } = initSchema(schema);

export {
  RuralAddress
};