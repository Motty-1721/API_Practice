const NEWS_API_KEY = '6dbd19765293470998c2bae1ae07a0b0'; // Get from https://newsapi.org/register

async function fetchNews(category = 'general') {
    const placeholder = document.querySelector('#news .api-placeholder');
    
    // Show loading state
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <h3>Loading News...</h3>
            <p>Fetching the latest ${category} headlines</p>
        </div>
    `;

    try {
        // First try with NewsAPI (requires key)
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles.length > 0) {
            displayNews(data.articles, category);
        } else {
            // Fallback to demo data if API fails or returns no articles
            throw new Error('No articles found or API limit reached');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        
        // Show demo data when API fails
        showDemoNews(category);
        
        // Optional: Show error message
        setTimeout(() => {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'background: #ef4444; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;';
            errorDiv.innerHTML = `
                <strong>API Note:</strong> Using demo data. For real news, get a free API key from 
                <a href="https://newsapi.org" target="_blank" style="color: white; text-decoration: underline;">NewsAPI.org</a>
                and replace "YOUR_API_KEY_HERE" in news.js
            `;
            placeholder.appendChild(errorDiv);
        }, 100);
    }
}

function displayNews(articles, category) {
    const placeholder = document.querySelector('#news .api-placeholder');
    
    let newsHtml = `
        <div class="news-controls">
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <select id="newsCategory" onchange="fetchNews(this.value)">
                    <option value="general" ${category === 'general' ? 'selected' : ''}>General</option>
                    <option value="business" ${category === 'business' ? 'selected' : ''}>Business</option>
                    <option value="technology" ${category === 'technology' ? 'selected' : ''}>Technology</option>
                    <option value="sports" ${category === 'sports' ? 'selected' : ''}>Sports</option>
                    <option value="entertainment" ${category === 'entertainment' ? 'selected' : ''}>Entertainment</option>
                    <option value="health" ${category === 'health' ? 'selected' : ''}>Health</option>
                    <option value="science" ${category === 'science' ? 'selected' : ''}>Science</option>
                </select>
                <button onclick="fetchNews(document.getElementById('newsCategory').value)" 
                        style="padding: 0.75rem 1.5rem; background: var(--primary); border: none; border-radius: 8px; color: white; cursor: pointer;">
                    Refresh News
                </button>
            </div>
        </div>
        <div class="news-grid">
    `;
    
    articles.forEach(article => {
        const imageUrl = article.urlToImage || 'https://via.placeholder.com/300x200/334155/6366f1?text=No+Image';
        const description = article.description || 'No description available. Click "Read More" to view the full article.';
        
        newsHtml += `
            <div class="news-card">
                <div class="news-image">
                    <img src="${imageUrl}" 
                         alt="${article.title}" 
                         onerror="this.src='https://via.placeholder.com/300x200/334155/6366f1?text=No+Image'">
                </div>
                <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${description}</p>
                    <div class="news-meta">
                        <span class="news-source">${article.source?.name || 'Unknown Source'}</span>
                        <span class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <a href="${article.url}" target="_blank" class="news-link">Read Full Article</a>
                </div>
            </div>
        `;
    });
    
    newsHtml += '</div>';
    placeholder.innerHTML = newsHtml;
}

// Demo news data for when API is not available
function showDemoNews(category) {
    const demoNews = {
        general: [
            {
                title: "Breaking: Major Technological Advancement Announced",
                description: "Scientists have made a groundbreaking discovery that could change the future of technology as we know it.",
                source: { name: "Tech News" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/300x200/334155/6366f1?text=Tech+News"
            },
            {
                title: "Global Markets Show Positive Trends",
                description: "International markets are experiencing growth with promising indicators for the upcoming quarter.",
                source: { name: "Finance Daily" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/300x200/334155/6366f1?text=Finance"
            }
        ],
        technology: [
            {
                title: "New AI Model Breaks Performance Records",
                description: "Latest artificial intelligence model achieves unprecedented results in natural language processing tasks.",
                source: { name: "AI Weekly" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/300x200/334155/6366f1?text=AI+Tech"
            },
            {
                title: "Quantum Computing Milestone Reached",
                description: "Researchers have successfully maintained quantum coherence for record-breaking duration.",
                source: { name: "Science Tech" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/300x200/334155/6366f1?text=Quantum"
            }
        ],
        sports: [
            {
                title: "Championship Finals Set for Next Weekend",
                description: "After intense semi-finals, the two top teams will compete for the championship title.",
                source: { name: "Sports Network" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://via.placeholder.com/300x200/334155/6366f1?text=Sports"
            }
        ]
    };

    const articles = demoNews[category] || demoNews.general;
    displayNews(articles, category);
}

// Initialize news when the page loads
if (document.getElementById('news') && !document.getElementById('news').classList.contains('hidden')) {
    fetchNews('general');
}