const foodUtils  = require("./foodUtils");

describe("foodUtils tests", () => {
  it("lists the names of all foods", () => {
    const overrideForTesting = {
      categoryOne: [
        { name: "aaa" },
        { name: "bbbbb" }
      ],
      categoryTwo: [
        { name: "cccccccc" },
        { name: "dd" }
      ]
    }

    const names = foodUtils.listNames(overrideForTesting);

    expect(names).toEqual([ "cccccccc", "bbbbb", "aaa", "dd" ]);
  });
});
