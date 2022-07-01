import db from "../utils/db.js";
import {v4 as uuidv4} from "uuid";

const parameterModel = {

    get: async (key) => {
        const parameter = await db("parameter").where("key", key);
        console.log(parameter)
        if (parameter.length === 0) {
            return null;
        }
        return parameter[0].value;
    },

    set: async (key, value) => {
        const entity = {
            key,
            value
        };

        const current = await db("parameter").where("key", key);
        if (current.length > 0) {
            //update
            const newData = await db("parameter")
                .where("key", key)
                .update(entity);
            return newData
        } else {
            const newData = await db("parameter").insert(entity);
            return newData;
        }
    },

};

export default parameterModel;
