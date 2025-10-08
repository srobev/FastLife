import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';

const ajv = new Ajv({ allErrors: true, coerceTypes: true });

const schemasDir = path.join(__dirname, '../../node_modules/@fastlife/shared/dist/schemas');

const loadSchema = (name: string) => {
  const filePath = path.join(schemasDir, `${name}.schema.json`);
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  ajv.addSchema(schema, name);
};

loadSchema('TurnActions');
loadSchema('TurnResults');
loadSchema('RoomState');
loadSchema('MapState');

export const validateTurnActions = ajv.getSchema('TurnActions');
export const validateTurnResults = ajv.getSchema('TurnResults');
export const validateRoomState = ajv.getSchema('RoomState');
export const validateMapState = ajv.getSchema('MapState');

export { ajv };
