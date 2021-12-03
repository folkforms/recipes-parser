const fileio = require("@folkforms/file-io");
const metaDataParser = require("./metaDataParser");

describe("metaDataParser tests", () => {
  it("parses the metadata correctly", () => {
    const input = fileio.readJson("meta-data-parser/test-data/input-1.json");
    const expected = fileio.readJson("meta-data-parser/test-data/expected-1.json");

    const actual = metaDataParser(input);

    expect(actual).toEqual(expected);
  });
});
