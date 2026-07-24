import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const InventoryLog = sequelize.define("InventoryLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Products",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  type: {
    type: DataTypes.ENUM("IN", "OUT", "SALE", "ADJUSTMENT"),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  previousStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  newStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default InventoryLog;
