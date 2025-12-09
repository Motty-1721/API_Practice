// CoinGecko API - NO AUTHENTICATION REQUIRED
async function fetchCryptoData(cryptoId = 'bitcoin') {
    const placeholder = document.querySelector('#finance .api-placeholder');
    
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <h3>Loading Cryptocurrency Data...</h3>
        </div>
    `;

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=true`);
        const data = await response.json();
        
        const marketData = data.market_data;
        const priceChange = marketData.price_change_percentage_24h;
        const isPositive = priceChange >= 0;
        
        placeholder.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1)); border-radius: 12px;">
                    <img src="${data.image.large}" alt="${data.name}" style="width: 80px; height: 80px; border-radius: 50%;">
                    <div>
                        <h2 style="margin: 0;">${data.name} (${data.symbol.toUpperCase()})</h2>
                        <span style="background: #6366f1; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem;">Rank #${data.market_cap_rank}</span>
                    </div>
                </div>
                
                <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 3rem; font-weight: 700; color: #1f2937;">$${marketData.current_price.usd.toLocaleString()}</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: ${isPositive ? '#10b981' : '#ef4444'};">
                        ${isPositive ? '↗' : '↘'} ${priceChange.toFixed(2)}% (24h)
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Market Cap</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">$${(marketData.market_cap.usd / 1e9).toFixed(2)}B</div>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">24h Volume</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">$${(marketData.total_volume.usd / 1e9).toFixed(2)}B</div>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">24h High</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">$${marketData.high_24h.usd.toLocaleString()}</div>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">24h Low</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">$${marketData.low_24h.usd.toLocaleString()}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Popular Cryptocurrencies</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem;">
                        ${['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana', 'ripple', 'cardano', 'dogecoin'].map(id => `
                            <button onclick="fetchCryptoData('${id}')" style="padding: 0.75rem; background: white; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                ${id.charAt(0).toUpperCase() + id.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <h4 style="margin-bottom: 1rem;">📊 API Information</h4>
                    <p style="margin: 0.5rem 0;"><strong>API:</strong> CoinGecko (No Authentication Required)</p>
                    <p style="margin: 0.5rem 0;"><strong>Status:</strong> Live data - No API key needed!</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        placeholder.innerHTML = `
            <div style="text-align: center; color: #ef4444;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Error Loading Data</h3>
                <p>Could not fetch cryptocurrency data. Please try again.</p>
            </div>
        `;
    }
}

// Auto-load Bitcoin when page loads
if (document.getElementById('finance')) {
    fetchCryptoData('bitcoin');
}