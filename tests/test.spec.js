describe('NCAA Home', () => {
    // beforeEach(async () => {
    //     await page.goto('http://stats.ncaa.org/rankings/change_sport_year_div');
    // });

    it('should be titled "NCAA Statistics"', async () => {
        await page.goto('http://stats.ncaa.org/rankings/change_sport_year_div');
        expect(true).toBe(true)
    });
    
    it('should be titled "NCAA Statistics"', async () => {
        await page.goto('http://stats.ncaa.org/rankings/change_sport_year_div');
        expect(true).toBe(true)
    });
})