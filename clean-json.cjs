const fs = require('fs');

// Read the JSON file
let rawData = fs.readFileSync('data/twc1_data.json', 'utf8');

// Strategy: Replace problematic characters ONLY within string values
// We'll process line by line to be safer
let lines = rawData.split('\n');
let processedLines = lines.map(line => {
  // Only process lines that contain string values (have quotes and colon or are array elements)
  if (line.includes(': "') || line.trim().startsWith('"')) {
    return line
      .replace(/&#34;/g, "'")     // HTML entity for quote
      .replace(/&#61;>/g, "=>")    // HTML entity for =>
      .replace(/&#39;/g, "'")      // HTML entity for apostrophe
      .replace(/\u201C/g, "'")     // Left curly quote
      .replace(/\u201D/g, "'")     // Right curly quote
      .replace(/\u2018/g, "'")     // Left curly apostrophe
      .replace(/\u2019/g, "'");    // Right curly apostrophe
  }
  return line;
});

let cleanedData = processedLines.join('\n');

// Parse and re-stringify to validate and format
const jsonData = JSON.parse(cleanedData);

// Write the cleaned JSON
fs.writeFileSync('data/twc1_data_clean.json', JSON.stringify(jsonData, null, 2));
fs.writeFileSync('public/data/twc1_data.json', JSON.stringify(jsonData, null, 2));

console.log('JSON cleaned successfully!');
console.log('Thinkies count:', jsonData.thinkies.length);
