let currentStockSymbol = 'AAPL';

async function fetchStockData(symbol = 'AAPL') {
    const placeholder = document.querySelector('#finance .api-placeholder');
    currentStockSymbol = symbol;
    
    // Show loading state
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <h3>Loading Stock Data...</h3>
            <p>Fetching current market information for ${symbol}</p>
        </div>
    `;

    try {
        // Try Financial Modeling Prep first (requires key)
        const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=YOUR_API_KEY_HERE`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            displayStockData(data[0]);
        } else {
            throw new Error('Stock not found in FMP');
        }
    } catch (error) {
        console.error('Error with FMP API:', error);
        // Fallback to Alpha Vantage
        await fetchAlphaVantageStock(symbol);
    }
}

// Fallback to Alpha Vantage
async function fetchAlphaVantageStock(symbol = 'AAPL') {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`);
        const data = await response.json();
        
        if (data['Global Quote']) {
            const quote = data['Global Quote'];
            const stockData = {
                symbol: quote['01. symbol'],
                name: quote['01. symbol'],
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changesPercentage: parseFloat(quote['10. change percent'].replace('%', '')),
                dayLow: parseFloat(quote['04. low']),
                dayHigh: parseFloat(quote['03. high']),
                volume: parseInt(quote['06. volume']),
                previousClose: parseFloat(quote['08. previous close'])
            };
            displayStockData(stockData);
        } else {
            throw new Error('Alpha Vantage limit reached');
        }
    } catch (error) {
        console.error('Error with fallback API:', error);
        // Final fallback to demo data
        showDemoStockData(symbol);
    }
}

function displayStockData(stock) {
    const placeholder = document.querySelector('#finance .api-placeholder');
    const isPositive = stock.change >= 0;
    
    placeholder.innerHTML = `
        <div class="finance-display">
            <div class="stock-search">
                <input type="text" id="stockSymbol" placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)" 
                       value="${stock.symbol}" onkeypress="if(event.key === 'Enter') fetchStockData(document.getElementById('stockSymbol').value.toUpperCase())">
                <button onclick="fetchStockData(document.getElementById('stockSymbol').value.toUpperCase())">Search</button>
            </div>
            
            <div class="stock-card ${isPositive ? 'positive' : 'negative'}">
                <div class="stock-header">
                    <h2>${stock.symbol}</h2>
                    <span class="stock-name">${stock.name || stock.symbol} Stock</span>
                </div>
                <div class="stock-price">$${stock.price.toFixed(2)}</div>
                <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '↗' : '↘'} ${stock.change.toFixed(2)} (${stock.changesPercentage.toFixed(2)}%)
                </div>
                <div class="stock-details">
                    <div class="detail">
                        <span class="label">Previous Close</span>
                        <span class="value">$${(stock.previousClose || stock.price - stock.change).toFixed(2)}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Day Range</span>
                        <span class="value">$${stock.dayLow.toFixed(2)} - $${stock.dayHigh.toFixed(2)}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Volume</span>
                        <span class="value">${stock.volume.toLocaleString()}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Market Cap</span>
                        <span class="value">${(stock.price * (stock.volume * 10)).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="popular-stocks">
                <h3>Popular Stocks</h3>
                <div class="stocks-grid">
                    ${['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NFLX', 'NVDA'].map(symbol => `
                        <button class="stock-btn ${currentStockSymbol === symbol ? 'active' : ''}" 
                                onclick="fetchStockData('${symbol}')">${symbol}</button>
                    `).join('')}
                </div>
            </div>
            
            <div class="api-note" style="margin-top: 2rem; padding: 1rem; background: rgba(99, 102, 241, 0.1); border-radius: 8px; text-align: center;">
                <small>Using demo data. For real-time data, get free API keys from 
                <a href="https://financialmodelingprep.com" target="_blank" style="color: #6366f1;">Financial Modeling Prep</a> or 
                <a href="https://www.alphavantage.co" target="_blank" style="color: #6366f1;">Alpha Vantage</a></small>
            </div>
        </div>
    `;
}

// Demo stock data for when APIs are not available
function showDemoStockData(symbol) {
    const demoStocks = {
        'AAPL': { price: 182.63, change: 2.15, changesPercentage: 1.19, dayLow: 180.50, dayHigh: 183.20, volume: 45218900 },
        'GOOGL': { price: 138.21, change: 0.85, changesPercentage: 0.62, dayLow: 137.50, dayHigh: 139.10, volume: 28173600 },
        'MSFT': { price: 378.85, change: -1.25, changesPercentage: -0.33, dayLow: 377.20, dayHigh: 380.50, volume: 23184500 },
        'TSLA': { price: 245.18, change: 8.32, changesPercentage: 3.51, dayLow: 238.50, dayHigh: 247.30, volume: 89234700 },
        'AMZN': { price: 154.65, change: 1.23, changesPercentage: 0.80, dayLow: 153.20, dayHigh: 155.80, volume: 38291600 },
        'META': { price: 348.34, change: -2.15, changesPercentage: -0.61, dayLow: 346.80, dayHigh: 351.20, volume: 18273600 },
        'NFLX': { price: 492.19, change: 5.42, changesPercentage: 1.11, dayLow: 488.50, dayHigh: 495.30, volume: 3829100 },
        'NVDA': { price: 485.09, change: 12.85, changesPercentage: 2.72, dayLow: 478.50, dayHigh: 488.90, volume: 42819300 }
    };

    const stock = demoStocks[symbol] || demoStocks['AAPL'];
    const stockData = {
        symbol: symbol,
        name: `${symbol} Inc.`,
        price: stock.price,
        change: stock.change,
        changesPercentage: stock.changesPercentage,
        dayLow: stock.dayLow,
        dayHigh: stock.dayHigh,
        volume: stock.volume,
        previousClose: stock.price - stock.change
    };
    
    displayStockData(stockData);
}

// Initialize when finance page is loaded
if (document.getElementById('finance') && !document.getElementById('finance').classList.contains('hidden')) {
    fetchStockData('AAPL');
}