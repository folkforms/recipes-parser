const foods = require("./foods");
const calculateCalories = require("./calculateCalories");

const parseIngredients = obj => {
  if(!obj.ingredients) { return obj; }
  obj.ingredientsParsed = [];
  obj.ingredients.forEach(item => {

    if(item.startsWith("- ") || item.startsWith("* ")) {
      item = item.substring(2);
    }

    let hasFoodDotJsonEntry = false;
    let hasUnit = false;
    let parsedIngredient = null;
    for(let i = 0; i < foods.length; i++) {
      if(item.toLowerCase().indexOf(foods[i]) !== -1) {
        hasFoodDotJsonEntry = true;
        // Name
        parsedIngredient = { name: foods[i] };

        // Count
        const regexp = new RegExp("(\\d+)\\s?.*", "g");
        const match = regexp.exec(item);
        if(match && match.length > 1) {
          parsedIngredient.count = match[1];
        } else {
          console.warn(`No count for ingredient ${item} in recipe ${obj.filename}`);
          parsedIngredient = null;
          continue;
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
        const regexpUnit = new RegExp("^(\\d+|\\d\/\\d|\\d\\.\\d+)\\s?(kg|g|tsp|dsp|rounded dsp|Tbsp|tbsp|tablespoons|ml|small tin|tin|slices)");
        const matchUnit = regexpUnit.exec(item);
        if(matchUnit && matchUnit.length > 2) {
          hasUnit = true;
          parsedIngredient.unit = matchUnit[2];
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
          } else if(parsedIngredient.unit === "small tin") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 200);
          } else if(parsedIngredient.unit === "tin") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 400);
          } else if(parsedIngredient.unit === "tsp") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 5);
          } else if(parsedIngredient.unit === "dsp" || parsedIngredient.unit === "rounded dsp") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 10);
          } else if(parsedIngredient.unit === "Tbsp" || parsedIngredient.unit === "tbsp" || parsedIngredient.unit === "tablespoons") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 15);
          } else if(parsedIngredient.name === "bacon" && parsedIngredient.unit === "slices") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 40);
          } else if(parsedIngredient.name === "parma ham" && parsedIngredient.unit === "slices") {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 21);
          } else if(parsedIngredient.name === "egg" && parsedIngredient.unit === null) {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * 48);
          } else {
            throw new Error(`Could not parse count = ${parsedIngredient.count} and unit = ${parsedIngredient.unit} for ${JSON.stringify(item)}`);
          }
        }

        // Special cases
        if(parsedIngredient.name === "tomato" && parsedIngredient.unit === null) {
          parsedIngredient.unit = "g";
          parsedIngredient.count = parsedIngredient.count * 82; // One tomato weighs around 82g
        }

        break;
      }
    }
    if(parsedIngredient) {
      obj.ingredientsParsed.push(parsedIngredient);
    } else {
      if(!hasFoodDotJsonEntry) {
        console.warn(`No food.json entry found for ingredient '${item}' in ${obj.filename}`);
      } else if(!hasUnit) {
        console.warn(`No unit found for ingredient '${item}' in ${obj.filename}`);
      }
    }
  });
  obj.calories = calculateCalories(obj.ingredientsParsed, obj);
  if(obj.metaData.serves) {
    obj.caloriesPerServing = obj.calories / obj.metaData.serves;
  }
  return obj;
}

module.exports = parseIngredients;
