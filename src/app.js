const { readFileSync, existsSync, writeFileSync, copyFileSync } = require('fs');
const rl = require('readline');
const { promisify } = require('util');
const { join, dirname } = require('path');

const getScriptArgs = () => {
    const args = (process.argv).slice(2);
    if (args.length) {
        return args.reduce((args, arg) => {
            const matches = arg.match(new RegExp('^--([-a-z]+)=(.*)$'));
            if (matches !== null) {
                const [, key, value] = matches;
                args[key] = (typeof value === 'string'
                    && ['true', 'false'].includes(value))
                        ? (value === 'true')
                        : value;
            }
            return args;
        }, {});
    }
};

const getFirstLevelPackageInfo = (packageJSONPath, returnString = false) => {

    const nodeModulesFolder = join(dirname(packageJSONPath), 'node_modules');
    const mainJSONContent = require(packageJSONPath);

    if (!Object.keys(mainJSONContent).length) {
        return;
    }

    const infoArray = Object
        .keys(mainJSONContent)
        .reduce((accumulator, key) => {
            if (['dependencies', 'devDependencies'].includes(key)) {
                const objKeys = Object.keys(mainJSONContent[key]);
                if (objKeys.length) {
                    objKeys.forEach(packageName => {
                        if (existsSync(join(nodeModulesFolder, packageName, 'package.json'))) {
                            const jsonContent = require(join(nodeModulesFolder, packageName, 'package.json'));
                            accumulator.push({
                                name: packageName,
                                description: (jsonContent.description || '[not found]'),
                                homepage: (jsonContent.homepage || '[not found]'),
                                version: (jsonContent.version || '[not found]'),
                            });
                        }
                    });
                }
            }
            return accumulator;
        }, [])
        .sort((first, second) =>
            (first.name < second.name)
                ? -1
                : (first.name > second.name)
                ? 1 : 0);


    if (!Object.keys(infoArray).length) {
        return;
    }

    if (!returnString) {
        return infoArray;
    }

    return infoArray.reduce((accumulator, packageObj) => {
        accumulator += `| ${packageObj.name} | ${packageObj.version} | ${packageObj.description} | ${packageObj.homepage} |\n\r`;
        return accumulator;
    }, '');
};

const replacePlaceholders = (replacements, fileContent) => {
    Object.entries(replacements).forEach(([key, value]) => {

        if (`${value}`.length) {

            const startIf = `{{\\sIF:${key}\\s}}`;
            const endIf = `{{\\sEND-IF\\s}}`;
            const regex = `${startIf}((.|\\n)*?)${endIf}`;

            const multiMatch = fileContent.match(new RegExp(regex, 'gm'));
            // console.log('multiMatch', key, multiMatch);

            if (multiMatch !== null
                && multiMatch.length) {

                let multiMatchResult = multiMatch[0];
                // console.log('multiMatchResult', multiMatchResult);

                const singleRegex = `{{\\s${key}\\s}}`;
                const singleMatch = multiMatchResult.match(new RegExp(singleRegex, 'gm'));

                if (singleMatch !== null
                    && singleMatch.length === 1) {

                    multiMatchResult = multiMatchResult
                        .replace(singleMatch[0], `${value}`);
                }

                fileContent = fileContent
                    .replace(multiMatch[0], multiMatchResult
                        .replace(new RegExp(startIf, 'gm'), '')
                        .replace(new RegExp(endIf, 'gm'), ''));
            } else {
                const singleMatch = fileContent.match(new RegExp(`{{\\s${key}\\s}}`, 'gm'));

                if (singleMatch !== null
                    && singleMatch.length === 1) {

                    fileContent = fileContent.replace(singleMatch[0], `${value}`);
                }
            }
        }
    });

    /**
     * 1.) Remove single- and multi-line placeholders
     * 2.) Replace multi line-breks with a single line-break
     */
    return fileContent
        .replace(new RegExp('{{\\sIF:[_A-Z]+\\s}}((.|\\n)*?){{\\sEND-IF\\s}}', 'gm'), '')
        .replace(new RegExp('(\\r\\n|\\n|\\r){2,}', 'gm'), '\n\r');
};

const readline = rl
    .createInterface({
        input: process.stdin,
        output: process.stdout
});

readline.question[promisify.custom] = (question) => {
    return new Promise((resolve) => {
        readline.question(question, resolve);
    });
};
const questionPromise = promisify(readline.question);

let README_TEMPLATE_FILE_NAME =  'README.tpl.md';
let README_FILE_NAME =  'README.md';
let README_FILE_COPY_NAME =  'README.copy.md';

const README_TEMPLATE_FILE_PATH = join(__dirname, README_TEMPLATE_FILE_NAME);
const README_FILE_PATH = join(__dirname, README_FILE_NAME);
const PACKAGE_JSON_FILE_PATH = join(__dirname, 'package.json');

const QUESTION = {
    OVERWRITE: 'Do you want to overwrite the README.md file? [c (cancel) | y (yes) | n (no)]: ',
};

(async () => {

    let answer;
    let overwriteOutputFile = false;
    let packageInfo = {};

    const args = getScriptArgs();

    const inputFile = ('template' in args)
        ? args.template
        : README_TEMPLATE_FILE_PATH;

    if (!existsSync(inputFile)) {
        throw Error(`template '${README_TEMPLATE_FILE_NAME}' not found (${inputFile})`);
    }

    const packageFile = ('package' in args)
        ? args.package
        : PACKAGE_JSON_FILE_PATH;

    if (!existsSync(packageFile)) {
        throw Error(`package.json not found (${packageFile})`);
    } else {
        packageInfo = JSON.parse(readFileSync(packageFile).toString());
    }

    const outputFile = ('output' in args)
        ? args.output
        : README_FILE_PATH;

    const forceOverwrite = ('force' in args && args.force);

    if (!forceOverwrite
        && existsSync(outputFile)) {
        console.log(`README found: ${outputFile}!`);

        answer = await questionPromise(QUESTION.OVERWRITE);
        answer = `${answer}`.trim();
        readline.close();

        if (['y', 'yes'].includes(answer)) {
            overwriteOutputFile = true;
        } else if (['n', 'no'].includes(answer)) {
            overwriteOutputFile = false;
        } if (['c', 'cancel'].includes(answer)) {
            console.error(`abort!`);
            process.exit(1);
        }
    }

    const replacements = {
        PACKAGE_LIST: getFirstLevelPackageInfo(packageFile, true),
    };

    if ('version' in packageInfo) {
        replacements.APP_VERSION = (packageInfo.version);
    }

    if ('name' in packageInfo) {
        replacements.APP_NAME = (packageInfo.name);
    }

    if ('description' in packageInfo) {
        replacements.APP_DESCRIPTION = (packageInfo.description);
    }

    if ('license' in packageInfo) {
        replacements.APP_LICENSE = (packageInfo.license);
    }

    if (packageInfo && packageInfo.engines && packageInfo.engines.node) {
        replacements.NODE_VERSION = (packageInfo.engines.node);
    }

    const content = replacePlaceholders(replacements, readFileSync(inputFile).toString());

    if (!overwriteOutputFile) {
        copyFileSync(inputFile, join(dirname(inputFile), README_FILE_COPY_NAME));
    }

    writeFileSync(outputFile, content);

    console.log('the end');
    process.exit(0);
})().catch(err => {
    console.error(err.message);
    process.exit(1);
});
