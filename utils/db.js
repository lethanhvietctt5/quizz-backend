import knex from "knex";

const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "quizz",
  },
  pool: { min: 0, max: 10 },
});

export default db;
