let OS = process.platform
let currentPath = process.cwd()

WIN32_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '-–allow-file-access-from-files',
    '--user-agent=AppleWebKit Priority-Automation-Client',
    '--start-maximized',
    // '--start-fullscreen',
    `--load-extension=${currentPath}/extensions/kicgagenknliidcnkinbijjdfklmbmjb/1.11_0`,
    `--disable-extensions-except=${currentPath}/extensions/kicgagenknliidcnkinbijjdfklmbmjb/1.11_0`,
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
    '--load-extension=extensions/kicgagenknliidcnkinbijjdfklmbmjb/1.11_0',
    '--disable-extensions-except=extensions/kicgagenknliidcnkinbijjdfklmbmjb/1.11_0',
    '--disable-notifications',
]
LINUX_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '-–allow-file-access-from-files',
    '--user-agent=AppleWebKit Priority-Automation-Client',
    '--start-fullscreen',
    '--load-extension=extensions/kicgagenknliidcnkinbijjdfklmbmjb/1.11_0',
    '--disable-extensions-except=extensions/kicgagenknliidcnkinbijjdfklmbmjb/1.11_0',
    '--disable-notifications',
    // '--disable-features=site-per-process'
]


console.log('\nOS: ' + OS)
switch (OS) {
    case 'win32':
        module.exports = {
            launch: {
                headless: process.env.HEADLESS !== 'false',
                // slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
                // devtools: true,
                // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                args: WIN32_ARGS,
                defaultViewport: {
                    width: 1600,
                    height: 720
                },
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
                    defaultViewport: {
                        width: 1600,
                        height: 720
                    },
                } :
                    {
                        headless: process.env.HEADLESS !== 'false',
                        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
                        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                        args: DARWIN_ARGS,
                        defaultViewport: {
                            width: 1600,
                            height: 720
                        },
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
                defaultViewport: {
                    width: 1600,
                    height: 720
                },
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
                defaultViewport: {
                    width: 1600,
                    height: 720
                },
            },
        }
        break;
}