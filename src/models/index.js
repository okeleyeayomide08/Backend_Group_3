import User from "./User.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Supplier from "./Supplier.js";
import Sale from "./Sale.js";
import SaleItem from "./SaleItem.js";
import InventoryLog from "./InventoryLog.js";

// Category ↔ Product
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Supplier ↔ Product
Supplier.hasMany(Product, { foreignKey: "supplierId" });
Product.belongsTo(Supplier, { foreignKey: "supplierId" });

// User ↔ Sale
User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });

// Sale ↔ SaleItem
Sale.hasMany(SaleItem, { foreignKey: "saleId" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });

// Product ↔ SaleItem
Product.hasMany(SaleItem, { foreignKey: "productId" });
SaleItem.belongsTo(Product, { foreignKey: "productId" });

// Product ↔ InventoryLog
Product.hasMany(InventoryLog, { foreignKey: "productId" });
InventoryLog.belongsTo(Product, { foreignKey: "productId" });

// User ↔ InventoryLog
User.hasMany(InventoryLog, { foreignKey: "userId" });
InventoryLog.belongsTo(User, { foreignKey: "userId" });

export { User, Category, Product, Supplier, Sale, SaleItem, InventoryLog };
