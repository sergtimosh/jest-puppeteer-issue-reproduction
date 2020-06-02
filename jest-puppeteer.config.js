let OS = process.platform
// let currentPath = process.cwd()

const windowSize = {
    width: 1400,
    height: 800
}

WIN32_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '-–allow-file-access-from-files',
    '--user-agent=AppleWebKit Priority-Automation-Client',
    '--start-fullscreen',
    `--window-size=${windowSize.width + 200},${windowSize.height + 200}`,
    '--disable-notifications',
    // '--disable-features=site-per-process'
]
DARWIN_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '-–allow-file-access-from-files',
    '--user-agent=Macintosh AppleWebKit Priority-Automation-Client',
    '--start-fullscreen',
    `--window-size=${windowSize.width + 400},${windowSize.height + 200}`,
    // '--incognito',
    '--disable-notifications',
]
LINUX_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '-–allow-file-access-from-files',
    '--user-agent=AppleWebKit Priority-Automation-Client',
    '--start-fullscreen',
    `--window-size=${windowSize.width},${windowSize.height}`,
    '--disable-notifications',
    // '--disable-features=site-per-process'
]

switch (OS) {
    case 'win32':
        module.exports = {
            launch: {
                headless: process.env.HEADLESS !== 'false',
                // slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
                // devtools: true,
                // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                args: WIN32_ARGS,
                defaultViewport: windowSize,
            },
        }
        break;
    case 'darwin':
        module.exports = {
            launch:
                process.env.DEBUG ? {
                    headless: false,
                    devtools: true,
                    args: DARWIN_ARGS,
                    defaultViewport: windowSize,
                } :
                    {
                        headless: process.env.HEADLESS !== 'false',
                        // slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
                        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                        args: DARWIN_ARGS,
                        defaultViewport: windowSize,
                    },
        }
        break;
    case 'linux':
        module.exports = {
            launch: {
                headless: process.env.HEADLESS !== 'false',
                // slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
                devtools: true,
                // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                args: LINUX_ARGS,
                defaultViewport: windowSize,
            },
        }
        break;
    default:
        module.exports = {
            launch: {
                headless: process.env.HEADLESS !== 'false',
                // slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
                devtools: true,
                // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                args: LINUX_ARGS,
                defaultViewport: windowSize,
            },
        }
        break;
}