const foodUtils = require("./foodUtils");

const calculateCost = (ingredients, obj, foodsOverrideForTesting) => {
  let missingValues = false;
  let total = 0;
  ingredients.forEach(ingredient => {
    const costData = foodUtils.getData(ingredient, foodsOverrideForTesting);
    let subtotal = 0;
    if(!costData) {
      console.warn(`No cost data for ingredient ${JSON.stringify(ingredient)} in ${obj.filename}`);
      return 0;
    }
    if(ingredient.unit === "g" && costData.costPer100g) {
      const cost = ingredient.count / 100 * costData.costPer100g
      subtotal += parseFloat(cost.toFixed(3));
    } else {
      console.warn(`Missing costPer100g for '${ingredient.name}' in foods.json (ingredient = ${JSON.stringify(ingredient)})`);
      missingValues = true;
    }
    total += subtotal;
  });
  return missingValues ? "MISSING_DATA" : parseFloat(total.toFixed(2));
}

module.exports = calculateCost;
