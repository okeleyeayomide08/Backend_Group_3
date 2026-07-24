function generateSKU(categoryName) {
  const prefix = categoryName.substring(0, 3).toUpperCase();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const sku = prefix + "-" + randomNumber;

  return sku;
}

export { generateSKU };
