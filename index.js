const ArgumentParser = require('argparse').ArgumentParser;
const readline = require('readline')
const fs = require('fs');

const Rolling = require('./modules/Rolling');

function main() {
    try {
        const data = getParams();
        const rollingData = new Rolling(data.TAU);

        analyzeFile(data.path, rollingData);
    } catch(e) {
        displayError(e.message);
    }
}

/* parse args and manage help */
function getParams() {
    const parser = new ArgumentParser({
        version: '1.0.0',
        addHelp: true,
        description: 'Compute local information within a rolling time window.'
    });

    parser.addArgument('-t', {
        help: 'Value of rolling time window (in seconds)',
        defaultValue: 60,
        dest: 'TAU',
    });

    parser.addArgument('path', {
        help: 'Path of the file to proccess',
        metavar: '<path>'
    });

    const args = parser.parseArgs();

    return args;
}

function padWith(text, padText) {
    return (text + padText).slice(0, padText.length);
}

function prepareLine(data) {
    const padSize = new Map([
        ['time', '           '],
        ['value', '       '],
        ['nb', '    '],
        ['sum', '         '],
        ['min', '         '],
        ['max', '         '],
    ]);

    const text = [];
    padSize.forEach((pad, key) => {
        text.push(padWith(data[key].toString(), pad));
    });

    return text.join(' ');
}

function displayHeader() {
    const header = prepareLine({
        time: 'Time',
        value: 'Value',
        nb: 'N_O',
        sum: 'Roll_Sum',
        min: 'Min_Value',
        max: 'Max_Value',
    });
    console.log(header);
    console.log(header.replace(/./g, '-'));
}

function displayEntry(entry) {
    console.log(prepareLine(entry));
}

function analyzeFile(path, rollingData) {
    displayHeader();

    const lineReader = readline.createInterface({
        input: fs.createReadStream(path)
    });

    lineReader.on('line', function (line) {
        const [ts, value] = line.trim().split(/\s+/);
        rollingData.add({
            ts: parseInt(ts, 10),
            value: parseFloat(value),
        });
        displayEntry(rollingData.getState());
    });
}

function displayError(message) {
    console.error(message);
    process.exit(1);
}

main();
