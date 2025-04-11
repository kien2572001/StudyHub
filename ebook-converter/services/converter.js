const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class ConverterService {
    async convertToEpub(inputPath, outputPath) {
        const options = [
            '--enable-heuristics',
            '--page-breaks-before=/',
            '--chapter-mark=pagebreak',
            '--asciiize'
        ].join(' ');

        await execAsync(`ebook-convert "${inputPath}" "${outputPath}" ${options}`);
        return outputPath;
    }
}

module.exports = new ConverterService();
