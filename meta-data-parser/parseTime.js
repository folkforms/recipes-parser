const regexes = {
  HOURS_MINUTES_LETTERS: /(\d+)\s?h\s?(\d*)\s?m/,                // 1h30m, 2h 30m, 3 h 45 m, 4h 20 m, 5 h 30m
  HOURS_MINUTES_WORDS: /(\d+)\s?hour[s?]\s?(\d*)[minutes|mins]/, // 1 hour 10 minutes, 2 hours 20 mins, 3.5 hours
  HOURS_ONLY_LETTERS: /(\d+\.*\d*)\s?h/,                         // 1h, 1.5h, 2 h, 1.25 hrs, 1.25hrs
  HOURS_ONLY_WORDS: /(\d+\.*)\s?hour[s?]/,                       // 1 hour, 2 hours, 1hours, 2hours, 1.5 hours, 1.5hours
  MINUTES_ONLY_LETTERS: /(\d+)\s?m/,                             // 20m, 20 m
  MINUTES_ONLY_WORDS: /(\d+\.*)\s?minute[s?]/,                   // 20 minutes
}

const parseTime = (timeText, filename, debug = false) => {
  const keys = Object.keys(regexes);
  for(let i = 0; i < keys.length; i++) {
    const regex = regexes[keys[i]];
    const match = timeText.match(regex);
    if(match) {
      if(debug) {
        console.log(`#### matches (matched index ${i})`);
        console.log(`# filename = ${filename}`);
        console.log(`# match[0] = ${match[0]}`);
        console.log(`# match[1] = ${match[1]}`);
        console.log(`# match[2] = ${match[2]}`);
      }
      const firstGroup = Number(match[1]);
      const secondGroup = Number(match[2]) || 0;
      let total;
      if(i === 0 || i === 1) {
        total = firstGroup * 60 + secondGroup;
      } else if(i === 2 || i === 3) {
        total = firstGroup * 60;
      } else {
        total = firstGroup;
      }
      if(debug) {
        console.log(`# returning total = ${total}`);
        if(total > 300) {
          console.log(`# WARNING: Total is ${total}. This seems too big.`);
        }
      }
      return total;
    }
  }
  return -1;
};

module.exports = parseTime;
