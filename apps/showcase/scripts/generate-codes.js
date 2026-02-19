const fs = require('fs');
const path = require('path');

const UI_COMPS_DIR = path.join(__dirname, '../src/components/temp-ui-comps');
const OUTPUT_FILE = path.join(__dirname, '../src/app/bring-your-own-ui/codes.ts');

if (!fs.existsSync(UI_COMPS_DIR)) {
    console.error('Directory not found:', UI_COMPS_DIR);
    process.exit(1);
}

const files = fs.readdirSync(UI_COMPS_DIR).filter(file => file.endsWith('.tsx'));

let outputContent = '';

files.forEach(file => {
    const content = fs.readFileSync(path.join(UI_COMPS_DIR, file), 'utf8');
    // Use basename without extension for the variable name, e.g. DiscordStyle_CODE
    const componentName = path.basename(file, '.tsx');
    // JSON.stringify handles escaping correctly for a string literal
    outputContent += `export const ${componentName}_CODE = ${JSON.stringify(content)};\n\n`;
});

fs.writeFileSync(OUTPUT_FILE, outputContent);
console.log(`Successfully generated codes.ts with ${files.length} components.`);
