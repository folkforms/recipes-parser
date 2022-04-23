const parseTime = require('./parseTime');

const parseMetaData = obj => {
  if(!obj.metaDataUnparsed) { return obj; }

  obj.metaData = {};
  obj.metaDataUnparsed.forEach(line => {
    if(line.length === 0 || line.startsWith("//")) {
      return;
    } else if(line.toLowerCase().startsWith("from: ")) {
      obj.metaData.from = line.substring(6);
    } else if(line.toLowerCase().startsWith("from ")) {
      obj.metaData.from = line.substring(5); // FIXME Should I warn here and suggest using a proper metadata tag "FROM:"?
    } else if(line.startsWith("https://")) {
      obj.metaData.from = line;
    } else if(line.toLowerCase().startsWith("source: ")) {
      obj.metaData.from = line.substring(8); // FIXME Should I warn about using "SOURCE" here and suggest that it should be replaced with "FROM"?
    } else if(line.startsWith("SERVES: ")) {
      obj.metaData.serves = Number(line.substring(8));
    } else if(line.startsWith("Serves ")) {
      obj.metaData.serves = Number(line.substring(7));
    } else if(line.startsWith("TIME: ")) {
      obj.metaData.time = line.substring(6);
      obj.metaData.convertedTimeMinutes = parseTime(obj.metaData.time, obj.filename);
    } else if(line.startsWith("TAGS: ")) {
      obj.metaData.tags = line.substring(6).split(", ");
    } else if(line.startsWith("SHOPPING LIST: ")) {
      obj.metaData.shoppingList = line.substring(15).split(", ");
    } else {
      // Do nothing. Probably just some descriptive text.
      // console.log(`Unknown metadata item: '${line}' in file '${obj.filename}'`);
    }
  });
  delete obj.metaDataUnparsed;
  return obj;
}

module.exports = parseMetaData;
