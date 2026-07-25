import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Stores",
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Supplier;
