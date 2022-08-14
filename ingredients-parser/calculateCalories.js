const foodUtils = require("./foodUtils");

const calculateCalories = (ingredients, obj) => {
  let missingValues = false;
  let total = 0;
  ingredients.forEach(ingredient => {
    const calorieData = foodUtils.getData(ingredient);
    if(!calorieData) {
      console.warn(`No calorie data for ingredient ${JSON.stringify(ingredient)} in ${obj.filename}`);
      return 0;
    }
    // console.log(`# calorieData = ${JSON.stringify(calorieData)}`);
    // console.log(`# ingredient = ${JSON.stringify(ingredient)}`);

    if(ingredient.unit === "g") {
      const calories = ingredient.count / 100 * calorieData.caloriesPer100g
      if(calorieData.caloriesPer100g !== undefined) {
        total += calories;
      } else {
        console.warn(`Missing caloriesPer100g for '${ingredient.name}' in foods.json (ingredient = ${JSON.stringify(ingredient)})`);
        missingValues = true;
      }
    } else {
      throw new Error(`Unknown combination found when calculating calories: ingredient = ${JSON.stringify(ingredient)}, calorieData = ${JSON.stringify(calorieData)}, filename = ${obj.filename}`);
    }
  });
  return missingValues ? "MISSING_DATA" : total;
}

module.exports = calculateCalories;
