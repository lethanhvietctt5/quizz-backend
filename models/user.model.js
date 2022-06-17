import db from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

const userModel = {
  findUserById: async (user_id) => {
    const user = await db("user").where("user_id", user_id);

    if (user.length === 0) {
      return null;
    }
    return user[0];
  },

  findUserByEmail: async (email) => {
    const user = await db("user").where("email", email);
    if (user.length === 0) {
      return null;
    }
    return user[0];
  },

  updateUser: async (user_id, field, value) => {
    if (field === "user_id") return null;

    const user = await db("user").where("user_id", user_id);
    if (user.length === 0) {
      return null;
    }

    const userUpdated = await db("user")
      .where("user_id", user_id)
      .update(field, value);

    if (userUpdated) {
      return userUpdated;
    } else {
      return null;
    }
  },

  createUser: async (email, password, name) => {
    const entity = {
      user_id: uuidv4(),
      email,
      password,
      name,
    };
    const newUser = await db("user").insert(entity);

    return newUser;
  },
};

export default userModel;
