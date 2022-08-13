const foodsJson = require("./foods");

const validate = () => {
  console.log(`Validating foods.json:`);
  const data = _listData();
  let errors = false;
  for(let i = 0; i < data.length; i++) {
    if(data[i].specificUnits && !data[i].weightOfOneItem) {
      errors = true;
      console.log(`Validation error: ${JSON.stringify(data[i])} has specificUnits but no weightOfOneItem`);
    }
  }
  if(!errors) {
    console.log("Validation ok");
  }
}

const _listData = () => {
  const data = [];
  const categories = Object.keys(foodsJson);
  for(let i = 0; i < categories.length; i++) {
    const itemsInCategory = foodsJson[categories[i]];
    for(let j = 0; j < itemsInCategory.length; j++) {
      data.push(itemsInCategory[j]);
    }
  };
  return data;
}

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

module.exports = { validate, listNames, getData };
