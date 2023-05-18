const fs = require('fs');

try {
  let envFile = fs.readFileSync('./env.sample.js', "utf8");
  envFile = envFile.replaceAll('fontSize: "12px"', 'fontSize: "15px"')
  envFile = envFile.replaceAll('wxh: "50"', 'wxh: "55"')
  envFile = envFile.replaceAll('spaceLeft: "70px"', 'spaceLeft: "75px"');
  fs.writeFileSync('env.js', envFile);
  console.log('😎 Sylitas | Modify env successfully');
} catch (error) {
  console.log('😎 Sylitas | Error :', error);
}
