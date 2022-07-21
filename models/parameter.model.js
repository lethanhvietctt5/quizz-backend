import db from '../utils/db.js';

const parameterModel = {
  get: async key => {
    const parameter = await db('parameter').where('key', key);
    if (parameter.length === 0) {
      return null;
    }
    return parameter[0].value;
  },

  set: async (key, value) => {
    const entity = {
      key,
      value,
    };

    const current = await db('parameter').where('key', key);
    if (current.length > 0) {
      //update
      const newData = await db('parameter').where('key', key).update(entity);
      return newData;
    } else {
      const newData = await db('parameter').insert(entity);
      return newData;
    }
  },
};

export default parameterModel;
