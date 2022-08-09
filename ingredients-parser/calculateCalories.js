const calories = require("./calories.json");

const calculateCalories = (ingredients, obj) => {
  let total = 0;
  ingredients.forEach(ingredient => {
    const calorieData = findCalorieData(ingredient);
    if(!calorieData) {
      console.warn(`No calorie data for ingredient ${JSON.stringify(ingredient)} in ${obj.filename}`);
      return 0;
    }
    //console.log(`# calorieData = ${JSON.stringify(calorieData)}`);
    //console.log(`# ingredient = ${JSON.stringify(ingredient)}`);

    if(ingredient.unit === null && calorieData.superUnit === null) {
      const calories = ingredient.count * calorieData.calories
      //console.log(`# calories for ${ingredient.name} = ${ingredient.count} * ${calorieData.calories} = ${calories}`);
      total += calories;
    } else if(ingredient.unit === "g" && calorieData.superUnit === "100g") {
      const calories = ingredient.count / 100 * calorieData.calories
      //console.log(`# calories for ${ingredient.name} = ${ingredient.count} / 100 * ${calorieData.calories} = ${calories}`);
      total += calories;
    } else {
      if(calorieData.superUnit === "g") {
        console.warn(`WARN: calories.json entry ${JSON.stringify(calorieData)} has superUnit 'g' when it should be '100g'`);
      }
      throw new Error(`Unknown combination found when calculating calories: ingredient = ${JSON.stringify(ingredient)}, calorieData = ${JSON.stringify(calorieData)}, filename = ${obj.filename}`);
    }
  });

  return total;
}

const findCalorieData = ingredient => {
  for(let i = 0; i < calories.length; i++) {
    if(calories[i].name === ingredient.name) {
      return calories[i];
    }
  }
  return null;
}

module.exports = calculateCalories;
