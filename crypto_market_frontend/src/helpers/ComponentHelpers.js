
const getPossibleCurrencies = (portfolioData,allPairsData) =>{
        if (!portfolioData || !allPairsData) {
        return [];
        }

        
        // Get all currencies from the portfolio
        const currencies = Object.keys(portfolioData);
        const availableCurrencies = currencies.filter(currency =>
            portfolioData[currency]>0
        );
        
        const availableCurrenciesSet = new Set(availableCurrencies);

        // filter valid pairs where base is in portfolio
        const validPairs = Object.entries(allPairsData).filter(([pairKey,pairData]) =>
        {
            const baseCurrency = pairData.base;
            console.log("base: ",baseCurrency)
            const quoteCurrency = pairData.quote;
            console.log("Quote: ",quoteCurrency)
            return availableCurrenciesSet.has(baseCurrency) || availableCurrenciesSet.has(quoteCurrency);
        })
       
        return validPairs.map(([pairKey, pairData]) => ({
        pairKey,
        wsname: pairData.wsname,
        base: pairData.base,
        quote: pairData.quote,
        baseCurrencyInPortfolio: availableCurrenciesSet.has(pairData.base),
        quoteCurrencyInPortfolio: availableCurrenciesSet.has(pairData.quote),
        // Add the balance if available
        baseBalance: availableCurrenciesSet.has(pairData.base) ? portfolioData[pairData.base] : 0,
        quoteBalance: availableCurrenciesSet.has(pairData.quote) ? portfolioData[pairData.quote] : 0
        }));
};


export default getPossibleCurrencies;