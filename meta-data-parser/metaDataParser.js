const parseMetaData = obj => {
  if(!obj.metaDataUnparsed) { return obj; }

  obj.metaData = {};
  obj.metaDataUnparsed.forEach(line => {
    if(line.startsWith("FROM: ")) {
      obj.metaData.from = line.substring(6);
    } else if(line.startsWith("SERVES: ")) {
      obj.metaData.serves = line.substring(8);
    } else if(line.startsWith("TIME: ")) {
      obj.metaData.time = line.substring(6);
    } else if(line.startsWith("TAGS: ")) {
      obj.metaData.tags = line.substring(6).split(", ");
    } else if(line.startsWith("SHOPPING LIST: ")) {
      obj.metaData.shoppingList = line.substring(15).split(", ");
    } else {
      console.log(`Unknown metadata item: '${line}' in file '${obj.filename}'`);
    }
  });
  delete obj.metaDataUnparsed;
  return obj;
}

module.exports = parseMetaData;
