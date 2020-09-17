
const windowSize = {
    width: 1400,
    height: 800
}
module.exports = {
    launch: {
        args: [
            // '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '-–allow-file-access-from-files',
            '--start-fullscreen',
        ],
        // dumpio: true,
        headless: process.env.HEADLESS !== 'false',
        // ignoreHTTPSErrors: true,
        // exitOnPageError: false,
    },
    // browser: 'chromium',
    // browserContext: 'default',
}