describe('NCAA Home', () => {
    // beforeEach(async () => {
    //     await page.goto('http://stats.ncaa.org/rankings/change_sport_year_div');
    // });

    it('should be titled "NCAA Statistics"', async () => {
        await page.goto('http://stats.ncaa.org/rankings/change_sport_year_div');
        await expect(page.title()).resolves.toMatch('NCAA Statistics');
    });

    it('should be titled "NCAA Statistics"', async () => {
        await page.goto('http://stats.ncaa.org/rankings/change_sport_year_div');
        // await expect(page.title()).resolves.toMatch('NCAA Statistics');
    });
})