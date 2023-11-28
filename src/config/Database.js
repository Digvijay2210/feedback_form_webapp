import { Sequelize } from "sequelize";

const db = new Sequelize("feedback_form", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port:3308
});

export default db;
