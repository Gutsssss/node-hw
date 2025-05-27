
const fs = require('fs');
const path = require('path');


const args = process.argv.slice(2);
const parsedArgs = {};

args.forEach(arg => {
    if (arg.startsWith('--file=')) {
        parsedArgs.file = arg.split('=')[1];
    } else if (arg.startsWith('--search=')) {
        parsedArgs.search = arg.split('=')[1];
    } else if (arg === '--ignore-case') {
        parsedArgs.ignoreCase = true;
    }
});


if (!parsedArgs.file || !parsedArgs.search) {
    console.log('Usage: node grep-lite.js --file=<path> --search=<string> [--ignore-case]');
    process.exit(1);
}


if (!fs.existsSync(parsedArgs.file)) {
    console.error(`Error: File not found - ${parsedArgs.file}`);
    process.exit(1);
}


fs.readFile(parsedArgs.file, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
    }

    const lines = data.split('\n');
    const searchPattern = parsedArgs.ignoreCase 
        ? new RegExp(parsedArgs.search, 'i') 
        : parsedArgs.search;

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        let matchFound = false;

        if (typeof searchPattern === 'string') {
            matchFound = line.includes(searchPattern);
        } else {
            matchFound = searchPattern.test(line);
        }

        if (matchFound) {
        
            const highlightedLine = line.replace(
                new RegExp(`(${escapeRegExp(parsedArgs.search)})`, parsedArgs.ignoreCase ? 'gi' : 'g'),
                '\x1b[31m$1\x1b[0m'
            );
            console.log(`[Line ${lineNum}]: ${highlightedLine}`);
        }
    });
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}