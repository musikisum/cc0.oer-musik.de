const fs = require('fs').promises;

module.exports = class CsvParser {
  async parse(csvPath) {
    const csv = await fs.readFile(csvPath, 'utf8');
    const lines = csv.split('\n');
    const data = [];
    lines.forEach((line, index) => {
      if (index === 0 || line.trim() === '') {
        return;
      }

      const parts = line.split(';');
      if (parts.length < 5) {
        console.log('Invalid line:', line);
        return;
      }

      let whatever = parts[0].split('_')[0].split(' ')[0];
      let whatever2 = parts[1].trim();
      let whatever3 = parts[4].split(' ')[0].replace(/[:"]+$/, '');
      if (!/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)?$/.test(whatever)) {
        console.log('Invalid ID:', whatever);
      } else if (!/^[0-9]+$/.test(whatever2)) {
        console.log('Invalid PID:', whatever2);
      }  else if (!/^[a-zA-Z0-9-]+$/.test(whatever3) && !/^[a-zA-Z0-9]+:[abc]$/.test(whatever3)) {
        console.log('Invalid Track:', whatever3);
      } else {
        data.push({
          id: whatever,
          pid: whatever2,
          track: whatever3
        });
      }
    });
    return data;
  }
}
