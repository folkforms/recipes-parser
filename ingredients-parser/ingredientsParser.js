const foods = require("./foods");
const calculateCalories = require("./calculateCalories");

const parseIngredients = obj => {
  if(!obj.ingredients) { return obj; }
  obj.ingredientsParsed = [];
  obj.ingredients.forEach(item => {
    let parsedIngredient = null;
    for(let i = 0; i < foods.length; i++) {
      if(item.indexOf(foods[i]) !== -1) {
        // Name
        parsedIngredient = { name: foods[i] };

        // Count
        const regexp = new RegExp("(\\d+)\\s?.*", "g");
        const match = regexp.exec(item);
        if(match && match.length > 1) {
          parsedIngredient.count = match[1];
        }

        // Count for "1/2 tsp"
        const regexp2 = new RegExp("(\\d/\\d)\\s?.*", "g");
        const match2 = regexp2.exec(item);
        if(match2 && match2.length > 1) {
          parsedIngredient.count = match2[1];
        }

        // Count for 1.5 tsp
        const regexp3 = new RegExp("(\\d\\.\\d)\\s?.*", "g");
        const match3 = regexp3.exec(item);
        if(match3 && match3.length > 1) {
          parsedIngredient.count = match3[1];
        }

        // Type
        const regexpUnit = new RegExp("[\\d+|\\d/\\d|\\d\\.\\d]\\s?(kg|g|tsp|dsp|Tbsp|ml)", "g");
        const matchUnit = regexpUnit.exec(item);
        if(matchUnit && matchUnit.length > 1) {
          parsedIngredient.unit = matchUnit[1];
        } else {
          parsedIngredient.unit = null;
        }

        // Convert count from fractions to decimal
        const regexpFoo = new RegExp("(\\d)/(\\d+)", "g");
        const matchFoo = regexpFoo.exec(item);
        if(matchFoo && matchFoo.length > 2) {
          parsedIngredient.count = matchFoo[1] / matchFoo[2];
        }

        // Convert count and type from natural language "0.5 tsp" to standard term "2.5 g"
        if(parsedIngredient.count && parsedIngredient.unit) {
          if(parsedIngredient.unit === "g") {
            // Do nothing
          } else if(parsedIngredient.unit === "kg") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 1000);
          } else if(parsedIngredient.unit === "ml") {
            parsedIngredient.unit = "g";
          } else if(parsedIngredient.unit === "tsp") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 5);
          } else if(parsedIngredient.unit === "dsp") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 10);
          } else if(parsedIngredient.unit === "Tbsp") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 15);
          } else {
            throw new Error(`Could not parse count = ${parsedIngredient.count} and unit = ${parsedIngredient.unit} for ${JSON.stringify(item)}`);
          }
        }

        break;
      }
    }
    if(parsedIngredient) {
      obj.ingredientsParsed.push(parsedIngredient);
    }
  });
  obj.calories = calculateCalories(obj.ingredientsParsed);
  return obj;
}

module.exports = parseIngredients;
