const fileio = require("@folkforms/file-io");
const textFileParser = require("./textFileParser");

describe("textFileParser tests", () => {
  it("parses text files correctly", () => {
    const input = "text-file-parser/test-data/input-1.txt";
    const expectedOutput = "text-file-parser/test-data/expected-1.json";

    const actual = textFileParser(input);

    const expected = fileio.readLines(expectedOutput);
    expect(actual).toEqual(expected);
  });
});
