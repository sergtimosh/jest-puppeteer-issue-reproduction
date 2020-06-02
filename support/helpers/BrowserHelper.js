export const browserHelper = {

    async clearBrowserStorageAndCookies() {
        const client = await page.target().createCDPSession()
        await client.send('Network.clearBrowserCookies')
        await client.send('Network.clearBrowserCache')
    }
}