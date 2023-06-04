const fileio = require("@folkforms/file-io");
const ingredientsParser = require("./ingredientsParser");

describe("ingredientsParser tests", () => {
  it("parses the ingredients correctly", () => {
    const input = fileio.readJson("ingredients-parser/test-data/input-1.json");
    const expected = fileio.readJson("ingredients-parser/test-data/expected-1.json");
    const foodsOverrideForTesting = fileio.readJson("ingredients-parser/test-data/foods-override-for-testing.json");

    const actual = ingredientsParser(input, foodsOverrideForTesting);

    expect(actual).toEqual(expected);
  });
});
