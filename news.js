const NEWS_API_KEY = '6dbd19765293470998c2bae1ae07a0b0'; // Your NewsAPI key

// Make functions globally accessible
window.fetchNews = fetchNews;

async function fetchNews(category = 'general') {
    const placeholder = document.querySelector('#news .api-placeholder');
    
    if (!placeholder) {
        console.error('News placeholder element not found');
        return;
    }
    
    // Show loading state
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <h3>Loading News...</h3>
            <p>Fetching the latest ${category} headlines</p>
        </div>
    `;

    try {
        // Fetch news from NewsAPI
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${NEWS_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            displayNews(data.articles, category);
        } else if (data.code === 'apiKeyInvalid' || data.code === 'rateLimited') {
            // Show API error message
            showApiError(data.message || 'API key issue detected');
            showDemoNews(category);
        } else {
            // No articles found
            throw new Error('No articles found');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        
        // Show demo data when API fails
        showDemoNews(category);
        
        // Show error message
        setTimeout(() => {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'background: #ef4444; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;';
            errorDiv.innerHTML = `
                <strong>⚠️ API Note:</strong> Using demo data only. I need to upgrade my NewsAPI plan to provide live news.
            `;
            placeholder.appendChild(errorDiv);
        }, 100);
    }
}

function displayNews(articles, category) {
    const placeholder = document.querySelector('#news .api-placeholder');
    
    let newsHtml = `
        <div style="margin-bottom: 2rem;">
            <h2 style="margin-bottom: 1rem;">📰 ${getCategoryTitle(category)}</h2>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <select id="newsCategory" onchange="window.fetchNews(this.value)" style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; cursor: pointer;">
                    <option value="general" ${category === 'general' ? 'selected' : ''}>📰 General</option>
                    <option value="business" ${category === 'business' ? 'selected' : ''}>💼 Business</option>
                    <option value="technology" ${category === 'technology' ? 'selected' : ''}>💻 Technology</option>
                    <option value="sports" ${category === 'sports' ? 'selected' : ''}>⚽ Sports</option>
                    <option value="entertainment" ${category === 'entertainment' ? 'selected' : ''}>🎬 Entertainment</option>
                    <option value="health" ${category === 'health' ? 'selected' : ''}>🏥 Health</option>
                    <option value="science" ${category === 'science' ? 'selected' : ''}>🔬 Science</option>
                </select>
                <button onclick="window.fetchNews(document.getElementById('newsCategory').value)" 
                        style="padding: 0.75rem 1.5rem; background: #6366f1; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">
                    🔄 Refresh News
                </button>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
    `;
    
    articles.forEach(article => {
        const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x250/334155/6366f1?text=No+Image';
        const description = article.description || 'No description available. Click "Read More" to view the full article.';
        const title = article.title || 'Untitled Article';
        
        newsHtml += `
            <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="width: 100%; height: 200px; overflow: hidden; background: #f3f4f6;">
                    <img src="${imageUrl}" 
                         alt="${title}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x250/334155/6366f1?text=No+Image'">
                </div>
                <div style="padding: 1.5rem;">
                    <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${title}</h3>
                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin-bottom: 1rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 0.875rem; color: #9ca3af;">
                        <span style="font-weight: 600; color: #6366f1;">${article.source?.name || 'Unknown Source'}</span>
                        <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <a href="${article.url}" target="_blank" style="display: inline-block; padding: 0.5rem 1rem; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-size: 0.875rem; font-weight: 600; transition: background 0.3s;" onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">Read Full Article →</a>
                </div>
            </div>
        `;
    });
    
    newsHtml += '</div>';
    placeholder.innerHTML = newsHtml;
}

function getCategoryTitle(category) {
    const titles = {
        general: 'General News',
        business: 'Business News',
        technology: 'Technology News',
        sports: 'Sports News',
        entertainment: 'Entertainment News',
        health: 'Health News',
        science: 'Science News'
    };
    return titles[category] || 'News';
}

function showApiError(message) {
    console.error('News API Error:', message);
}

// Demo news data for when API is not available
function showDemoNews(category) {
    const demoNews = {
        general: [
            {
                title: "Breaking: Major Technological Advancement Announced",
                description: "Scientists have made a groundbreaking discovery that could change the future of technology as we know it. Researchers are optimistic about the practical applications.",
                source: { name: "Tech News" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/334155/6366f1?text=Tech+News"
            },
            {
                title: "Global Markets Show Positive Trends",
                description: "International markets are experiencing growth with promising indicators for the upcoming quarter. Analysts predict continued stability.",
                source: { name: "Finance Daily" },
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/059669/10b981?text=Finance"
            },
            {
                title: "Climate Summit Reaches Historic Agreement",
                description: "World leaders have committed to ambitious new targets for reducing carbon emissions by 2030.",
                source: { name: "World News" },
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/0891b2/06b6d4?text=Climate"
            }
        ],
        technology: [
            {
                title: "New AI Model Breaks Performance Records",
                description: "Latest artificial intelligence model achieves unprecedented results in natural language processing tasks, surpassing all previous benchmarks.",
                source: { name: "AI Weekly" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/7c3aed/a78bfa?text=AI+Tech"
            },
            {
                title: "Quantum Computing Milestone Reached",
                description: "Researchers have successfully maintained quantum coherence for record-breaking duration, bringing practical quantum computers closer to reality.",
                source: { name: "Science Tech" },
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/dc2626/f87171?text=Quantum"
            },
            {
                title: "5G Network Expansion Accelerates Globally",
                description: "Telecommunications companies announce major infrastructure investments to expand 5G coverage to rural areas.",
                source: { name: "Tech Today" },
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/ea580c/fb923c?text=5G"
            }
        ],
        sports: [
            {
                title: "Championship Finals Set for Next Weekend",
                description: "After intense semi-finals, the two top teams will compete for the championship title in what promises to be an epic showdown.",
                source: { name: "Sports Network" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/16a34a/4ade80?text=Sports"
            },
            {
                title: "Olympic Athlete Breaks World Record",
                description: "In a stunning performance, an athlete shattered a long-standing world record, setting a new benchmark for future competitors.",
                source: { name: "Sports Daily" },
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/ca8a04/facc15?text=Olympics"
            }
        ],
        business: [
            {
                title: "Tech Giant Announces Major Acquisition",
                description: "Leading technology company finalizes multi-billion dollar acquisition, expanding its market presence significantly.",
                source: { name: "Business Wire" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/334155/6366f1?text=Business"
            }
        ],
        entertainment: [
            {
                title: "Blockbuster Film Breaks Box Office Records",
                description: "New release shatters opening weekend records, becoming one of the highest-grossing films of all time.",
                source: { name: "Entertainment Weekly" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/be123c/fb7185?text=Movies"
            }
        ],
        health: [
            {
                title: "New Medical Treatment Shows Promising Results",
                description: "Clinical trials reveal breakthrough treatment demonstrates significant effectiveness in treating chronic conditions.",
                source: { name: "Health Today" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/0891b2/06b6d4?text=Health"
            }
        ],
        science: [
            {
                title: "Space Agency Announces Mars Mission Success",
                description: "Historic mission to Mars achieves all primary objectives, collecting valuable data about the red planet.",
                source: { name: "Space Science" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/400x250/7c3aed/a78bfa?text=Space"
            }
        ]
    };

    const articles = demoNews[category] || demoNews.general;
    // Add more demo articles to fill the grid
    const extendedArticles = [...articles];
    while (extendedArticles.length < 6) {
        extendedArticles.push(...articles.slice(0, 6 - extendedArticles.length));
    }
    
    displayNews(extendedArticles.slice(0, 12), category);
}

// Initialize news when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const newsElement = document.getElementById('news');
    if (newsElement && !newsElement.classList.contains('hidden')) {
        fetchNews('general');
    }
});
