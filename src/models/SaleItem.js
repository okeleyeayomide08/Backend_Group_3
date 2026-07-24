import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SaleItem = sequelize.define("SaleItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  saleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Sales",
      key: "id",
    },
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Products",
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

export default SaleItem;
