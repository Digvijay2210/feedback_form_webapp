// UserRating.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
const { DataTypes } = Sequelize;

const UserRating = db.define("userratings", {
  userId: {
    type: DataTypes.STRING,
  },

  rating1: {
    type: DataTypes.INTEGER,
    // validate: {
    //   min: 1,
    //   max: 5,
    // },
  },
  rating2: {
    type: DataTypes.INTEGER,
    // validate: {
    //   min: 1,
    //   max: 5,
    // },
  },
  rating3: {
    type: DataTypes.INTEGER,
    // validate: {
    //   min: 1,
    //   max: 5,
    // },
  },
  rating4: {
    type: DataTypes.INTEGER,
    // validate: {
    //   min: 1,
    //   max: 5,
    // },
  },
  rating5: {
    type: DataTypes.INTEGER,
    // validate: {
    //   min: 1,
    //   max: 5,
    // },
  },
  rating6: {
    type: DataTypes.INTEGER,
    // validate: {
    //   min: 1,
    //   max: 5,
    // },
  },
  feedback: {
    type: DataTypes.STRING,
  },
});

(async () => {
  await db.sync();
})();

UserRating.belongsTo(Users, { foreignKey: "userId" });

export default UserRating;
