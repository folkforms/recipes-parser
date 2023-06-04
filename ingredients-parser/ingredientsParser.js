const foodUtils = require("./foodUtils");
const calculateCalories = require("./calculateCalories");
const calculateCost = require("./calculateCost");
const genericConversions = require("./genericConversions");

const parseIngredients = (obj, foodsOverrideForTesting) => {
  if(!obj.ingredients) { return obj; }
  obj.ingredientsParsed = [];
  obj.ingredients.forEach(item => {
    if(item.length === 0) {
      return;
    }
    if(item.endsWith(":")) {
      return;
    }

    if(item.startsWith("- ") || item.startsWith("* ")) {
      item = item.substring(2);
    }

    const foodNames = foodUtils.listNames(foodsOverrideForTesting);

    let hasFoodDotJsonEntry = false;
    let hasUnit = false;
    let parsedIngredient = null;
    for(let i = 0; i < foodNames.length; i++) {
      if(item.toLowerCase().indexOf(foodNames[i]) !== -1) {
        hasFoodDotJsonEntry = true;
        // Name
        parsedIngredient = { name: foodNames[i] };

        // Count
        const regexp = new RegExp("(\\d+)\\s?.*", "g");
        const match = regexp.exec(item);
        if(match && match.length > 1) {
          parsedIngredient.count = match[1];
        } else {
          if(parsedIngredient.name === "salt" && !parsedIngredient.count) {
            parsedIngredient.count = "0.25";
            parsedIngredient.unit = "tsp"
          } else if(parsedIngredient.name === "pepper" && !parsedIngredient.count) {
            parsedIngredient.count = "0.5";
            parsedIngredient.unit = "tsp"
          } else {
            parsedIngredient.count = 1;
          }
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
        if(!parsedIngredient.unit) {
          const regexpUnit = new RegExp("^(\\d+|\\d\/\\d|\\d\\.\\d+)\\s?(kg|g|tsp|dsp|rounded dsp|Tbsp|tbsp|tablespoons|ml|small tin|tin|clove|slices)");
          const matchUnit = regexpUnit.exec(item);
          if(matchUnit && matchUnit.length > 2) {
            hasUnit = true;
            parsedIngredient.unit = matchUnit[2];
          } else {
            parsedIngredient.unit = null;
          }
        }

        // Convert count from fractions to decimal
        const regexpFoo = new RegExp("(\\d)/(\\d+)", "g");
        const matchFoo = regexpFoo.exec(item);
        if(matchFoo && matchFoo.length > 2) {
          parsedIngredient.count = matchFoo[1] / matchFoo[2];
        }

        // Convert count and type from natural language "0.5 tsp" to standard term "2.5 g"
        const genericUnits = genericConversions.map(c => c.unit);
        if(parsedIngredient.count) {
          const data = foodUtils.getData(parsedIngredient, foodsOverrideForTesting);
          if(parsedIngredient.unit === null) {
            if(data && data.weightOfOneItem) {
              parsedIngredient.unit = "g";
              parsedIngredient.count = String(parsedIngredient.count * data.weightOfOneItem);
            } else {
              throw new Error(`Conversion error (1): No unit and no weightOfOneItem for ${JSON.stringify(parsedIngredient)} in ${obj.filename}`);
            }
          } else if(data.specificUnits && data.specificUnits.includes(parsedIngredient.unit) && data.weightOfOneItem) {
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * data.weightOfOneItem);
          } else if(genericUnits.includes(parsedIngredient.unit)) {
            const multiplier = genericConversions.find(c => c.unit === parsedIngredient.unit).multiplier;
            parsedIngredient.unit = "g";
            parsedIngredient.count = String(parsedIngredient.count * multiplier);
          } else {
            throw new Error(`Conversion error (2): Unknown unit in ${JSON.stringify(parsedIngredient)} from ${JSON.stringify(item)} in ${obj.filename}`);
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
        console.warn(`No foods.json entry found for ingredient '${item}' in ${obj.filename}`);
      } else if(!hasUnit) {
        console.warn(`No unit found for ingredient '${item}' in ${obj.filename}`);
      }
    }
  });
  if(obj.metaData.serves) {
    obj.calories = calculateCalories(obj.ingredientsParsed, obj, foodsOverrideForTesting);
    if(typeof obj.calories === "number") {
      obj.caloriesPerServing = obj.calories / obj.metaData.serves;
    }
    obj.cost = calculateCost(obj.ingredientsParsed, obj, foodsOverrideForTesting);
  }
  return obj;
}

module.exports = parseIngredients;
