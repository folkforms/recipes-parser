const foods = require("./foods");

const parseMetaData = obj => {
  if(!obj.ingredients) { return obj; }
  obj.ingredientsParsed = [];
  obj.ingredients.forEach(item => {
    let parsedIngredient = null;
    for(let i = 0; i < foods.length; i++) {
      if(item.indexOf(foods[i]) !== -1) {
        // Ingredient
        parsedIngredient = { ingredient: foods[i] };

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
        const regexpType = new RegExp("[\\d+|\\d/\\d|\\d\\.\\d]\\s?(kg|g|tsp|dsp|Tbsp|ml)", "g");
        const matchType = regexpType.exec(item);
        if(matchType && matchType.length > 1) {
          parsedIngredient.type = matchType[1];
        } else {
          parsedIngredient.type = null;
        }

        // Convert count from fractions to decimal
        const regexpFoo = new RegExp("(\\d)/(\\d+)", "g");
        const matchFoo = regexpFoo.exec(item);
        if(matchFoo && matchFoo.length > 2) {
          parsedIngredient.count = matchFoo[1] / matchFoo[2];
        }

        // Convert count and type from natural language "0.5 tsp" to standard term "2.5 g"
        if(parsedIngredient.count && parsedIngredient.type) {
          if(parsedIngredient.type === "g") {
            // Do nothing
          } else if(parsedIngredient.type === "kg") {
            parsedIngredient.type = "g";
            parsedIngredient.count = String(parsedIngredient.count * 1000);
          } else if(parsedIngredient.type === "ml") {
            parsedIngredient.type = "g";
          } else if(parsedIngredient.type === "tsp") {
            parsedIngredient.type = "g";
            parsedIngredient.count = String(parsedIngredient.count * 5);
          } else if(parsedIngredient.type === "dsp") {
            parsedIngredient.type = "g";
            parsedIngredient.count = String(parsedIngredient.count * 10);
          } else if(parsedIngredient.type === "Tbsp") {
            parsedIngredient.type = "g";
            parsedIngredient.count = String(parsedIngredient.count * 15);
          } else {
            throw new Error(`Could not parse count = ${parsedIngredient.count} and type = ${parsedIngredient.type} for ${JSON.stringify(item)}`);
          }
        }

        break;
      }
    }
    if(parsedIngredient) {
      obj.ingredientsParsed.push(parsedIngredient);
    }
  });
  return obj;
}

module.exports = parseMetaData;
