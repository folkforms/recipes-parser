const calories = require("./calories.json");

const calculateCalories = ingredients => {
  let total = 0;
  ingredients.forEach(ingredient => {
    const calorieData = findCalorieData(ingredient);
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
      throw new Error(`Unknown combination found when calculating calories: ingredient = ${JSON.stringify(ingredient)}, calorieData = ${JSON.stringify(calorieData)}`);
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
  throw new Error(`Could not find calorie data for ingredient ${JSON.stringify(ingredient)}`);
}

module.exports = calculateCalories;
