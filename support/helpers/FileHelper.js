const https = require("https");
const fs = require("fs-extra");
const path = require("path");
const pdf = require("pdf-parse");
const XLSX = require("xlsx");
const crypto = require("crypto")

export const fileHelper = {

    async downloadHttps(url, dest) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest, { flags: "wx" });

            const request = https.get(url, response => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                } else {
                    file.close();
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
                }
            });

            request.on("error", err => {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(err);
            });

            file.on("finish", () => {
                resolve();
            });

            file.on("error", err => {
                file.close();

                if (err.code === "EEXIST") {
                    reject("File already exists");
                } else {
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject(err);
                }
            });
        });
    },

    async createDirectory(path) {
        await fs.mkdir(path).catch((e) => {
            console.log('Cant create dir: ' + e)
        })
    },

    async deleteDirectory(path) {
        if (fs.existsSync(path)) {
            await fs.remove(path).catch((e) => {
                console.log('Cant remove dir: ' + e)
            })
        }
    },

    async getFilesizeInBytes(filePath) {
        var stats = fs.statSync(filePath)
        return stats["size"]
    },

    async getPdfText(file) {
        let dataBuffer = fs.readFileSync(file)
        const data = await pdf(dataBuffer).catch(e => {
            console.log('Parse pdf error: ' + e)
        })
        return data.text
    },

    async waitForFileToDownload(path) {
        console.log('Waiting file to download...')
        let startTime = Date.now()
        let filename
        while (!filename || filename.endsWith('.crdownload') && Date.now() - startTime < 8000) {
            filename = fs.readdirSync(path)[0]
            await page.waitFor(500)
        }
        return filename
    },

    async getCellValue(filePath, cell) {
        let workbook = XLSX.readFile(filePath)
        let firstSheetName = workbook.SheetNames[0]
        let workSheet = workbook.Sheets[firstSheetName]
        let desiredCell = workSheet[cell]
        var value = (desiredCell ? desiredCell.v : undefined);
        console.log(cell + ' value= ' + value)
        return value
    },

    async getExcellSheetName(filePath, i) {
        let workbook = XLSX.readFile(filePath)
        let sheetName = workbook.SheetNames[i]
        console.log(`sheet name is ${sheetName}`)
        return sheetName
    },

    async setDownloadBehavior(dir) {
        const downloadDir = path.join(process.cwd(), dir)
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDir,
        }).catch(e => console.log(e))
    },

    async createFile(data, name, dir) {
        const filePath = path.join(dir, name)
        await fs.writeFile(filePath, data)
        return filePath
    },

    async readFile(filePath) {
        return await fs.readFile(filePath)
    },

    async getFileHash(filePath) {
        const buffer = fs.readFileSync(filePath)
        let sum = crypto.createHash('MD5')
        sum.update(buffer)
        return sum.digest('hex')
    },

    trimFilename(name, length) {
        const extension = name.substring(name.lastIndexOf('.'))
        return name.substr(0, length) + extension
    },

    randFilename(prefix, ext) {
        const date = Date.now()
        return `${date.toString()}_${prefix}.${ext}`
    }

}

export const fileHelperAssert = {

    async isFileExtension(fileName, ext) {
        const actualExt = fileName.substring(fileName.lastIndexOf('.'))
        expect(actualExt).toBe(ext)
    }
}