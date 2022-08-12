const foodsJson = require("./foods");

const listNames = overrideForTesting => {
  const data = overrideForTesting ? overrideForTesting : foodsJson;
  const names = [];
  const categories = Object.keys(data);
  categories.forEach(category => {
    const itemsInCategory = data[category];
    for(let i = 0; i < itemsInCategory.length; i++) {
      names.push(itemsInCategory[i].name);
    }
  });
  return names.sort((a, b) => b.length - a.length);
}

/**
 * `ingredient = { "count": "1000", "unit": "g", "name": "sugar" },`
 *
 * @param {*} ingredient 
 * @param {*} overrideForTesting 
 * @returns 
 */
const getData = (ingredient, overrideForTesting) => {
  const data = overrideForTesting ? overrideForTesting : foodsJson;
  const categories = Object.keys(data);
  for(let i = 0; i < categories.length; i++) {
    const itemsInCategory = data[categories[i]];
    for(let j = 0; j < itemsInCategory.length; j++) {
      if(itemsInCategory[j].name === ingredient.name) {
        return itemsInCategory[j];
      }
    }
  };
  return null;
}

module.exports = { listNames, getData };
