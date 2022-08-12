const foodUtils = require("./foodUtils");

const calculateCalories = (ingredients, obj) => {
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
      //console.log(`# calories for ${ingredient.name} = ${ingredient.count} / 100 * ${calorieData.calories} = ${calories}`);
      total += calories;
    } else {
      throw new Error(`Unknown combination found when calculating calories: ingredient = ${JSON.stringify(ingredient)}, calorieData = ${JSON.stringify(calorieData)}, filename = ${obj.filename}`);
    }
  });

  return total;
}

module.exports = calculateCalories;
