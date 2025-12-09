// TMDB API - REQUIRES API KEY
const TMDB_API_KEY = 'd79c48c48a52c1211e651b8f70d72753'; // Your TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Make functions globally accessible
window.fetchMovies = fetchMovies;
window.searchMovie = searchMovie;
window.getMovieDetails = getMovieDetails;

async function fetchMovies(category = 'popular') {
    const placeholder = document.querySelector('#movies .api-placeholder');
    
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <h3>Loading Movies...</h3>
        </div>
    `;

    // Check if API key is set
    if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔑</div>
                <h3>API Key Required</h3>
                <p>To use the TMDB API, you need to get a free API key:</p>
                <ol style="text-align: left; max-width: 500px; margin: 1.5rem auto; line-height: 2;">
                    <li>Visit <a href="https://www.themoviedb.org/signup" target="_blank" style="color: #6366f1;">TMDB.org</a> and create a free account</li>
                    <li>Go to Settings → API and request an API key</li>
                    <li>Copy your API key</li>
                    <li>Replace 'YOUR_TMDB_API_KEY_HERE' in the code with your actual key</li>
                </ol>
                <a href="https://www.themoviedb.org/settings/api" target="_blank" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Get Your Free API Key</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/${category}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        placeholder.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto;">
                <div style="margin-bottom: 2rem;">
                    <h2 style="margin-bottom: 1rem;">${getCategoryTitle(category)}</h2>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="text" id="movieSearch" placeholder="Search for a movie..." style="flex: 1; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;" onkeypress="if(event.key === 'Enter') window.searchMovie(document.getElementById('movieSearch').value)">
                        <button onclick="window.searchMovie(document.getElementById('movieSearch').value)" style="padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">🔍 Search</button>
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    ${['popular', 'top_rated', 'upcoming', 'now_playing'].map(cat => `
                        <button onclick="window.fetchMovies('${cat}')" style="padding: 0.75rem 1.5rem; background: ${category === cat ? '#6366f1' : 'white'}; color: ${category === cat ? 'white' : '#4b5563'}; border: 2px solid ${category === cat ? '#6366f1' : '#e5e7eb'}; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            ${getCategoryTitle(cat)}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    ${data.results.slice(0, 12).map(movie => `
                        <div onclick="window.getMovieDetails(${movie.id})" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.3s ease;">
                            <img src="${movie.poster_path ? TMDB_IMAGE_BASE + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.title}" style="width: 100%; height: 300px; object-fit: cover;">
                            <div style="padding: 1rem;">
                                <h3 style="font-size: 1rem; margin-bottom: 0.5rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${movie.title}</h3>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: #f59e0b; font-weight: 600;">⭐ ${movie.vote_average.toFixed(1)}</span>
                                    <span style="color: #6b7280;">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <h4 style="margin-bottom: 1rem;">🎬 API Information</h4>
                    <p style="margin: 0.5rem 0;"><strong>API:</strong> The Movie Database (TMDB)</p>
                    <p style="margin: 0.5rem 0;"><strong>Authentication:</strong> API Key Required ✓</p>
                    <p style="margin: 0.5rem 0;"><strong>Status:</strong> Connected Successfully!</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Fetch error:', error);
        placeholder.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Error Loading Movies</h3>
                <p>Could not fetch movie data. Please check your API key and internet connection.</p>
                <p style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">Error: ${error.message}</p>
            </div>
        `;
    }
}

async function searchMovie(query) {
    if (!query || query.trim() === '') {
        fetchMovies('popular');
        return;
    }
    
    const placeholder = document.querySelector('#movies .api-placeholder');
    placeholder.innerHTML = `<div style="text-align: center;"><div style="font-size: 3rem;">🔍</div><h3>Searching...</h3></div>`;
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results.length === 0) {
            placeholder.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>No movies found for "${query}"</h3>
                    <button onclick="window.fetchMovies('popular')" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">Back to Popular Movies</button>
                </div>
            `;
            return;
        }
        
        placeholder.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto;">
                <div style="margin-bottom: 2rem;">
                    <h2>Search Results for "${query}"</h2>
                    <button onclick="window.fetchMovies('popular')" style="margin-top: 1rem; padding: 0.5rem 1rem; background: white; color: #4b5563; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer;">← Back to Browse</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
                    ${data.results.slice(0, 12).map(movie => `
                        <div onclick="window.getMovieDetails(${movie.id})" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;">
                            <img src="${movie.poster_path ? TMDB_IMAGE_BASE + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.title}" style="width: 100%; height: 300px; object-fit: cover;">
                            <div style="padding: 1rem;">
                                <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">${movie.title}</h3>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: #f59e0b;">⭐ ${movie.vote_average.toFixed(1)}</span>
                                    <span style="color: #6b7280;">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        placeholder.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 2rem;">
                <h3>Search failed</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const movie = await response.json();
        
        const cast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';
        const director = movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A';
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem;';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative;">
                <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 10;">×</button>
                <div style="padding: 2rem; background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('${movie.backdrop_path ? 'https://image.tmdb.org/t/p/original' + movie.backdrop_path : ''}'); background-size: cover; color: white; display: flex; gap: 2rem; align-items: flex-start;">
                    <img src="${movie.poster_path ? TMDB_IMAGE_BASE + movie.poster_path : 'https://via.placeholder.com/300x450'}" style="width: 200px; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h2 style="font-size: 2rem; margin-bottom: 1rem;">${movie.title}</h2>
                        <div style="display: flex; gap: 1.5rem; margin-bottom: 1rem;">
                            <span>⭐ ${movie.vote_average.toFixed(1)}/10</span>
                            <span>📅 ${movie.release_date || 'N/A'}</span>
                            <span>⏱️ ${movie.runtime || 'N/A'} min</span>
                        </div>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${movie.genres?.map(g => `<span style="padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 0.875rem;">${g.name}</span>`).join('') || ''}
                        </div>
                    </div>
                </div>
                <div style="padding: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Overview</h3>
                    <p style="line-height: 1.6; color: #4b5563; margin-bottom: 2rem;">${movie.overview || 'No overview available.'}</p>
                    <div style="display: grid; gap: 1rem;">
                        <p><strong>Director:</strong> ${director}</p>
                        <p><strong>Cast:</strong> ${cast}</p>
                        <p><strong>Budget:</strong> ${movie.budget ? '$' + movie.budget.toLocaleString() : 'N/A'}</p>
                        <p><strong>Revenue:</strong> ${movie.revenue ? '$' + movie.revenue.toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Failed to load movie details. Please try again.');
    }
}

function getCategoryTitle(category) {
    const titles = {
        'popular': '🔥 Popular Movies',
        'top_rated': '⭐ Top Rated',
        'upcoming': '📅 Upcoming',
        'now_playing': '🎬 Now Playing'
    };
    return titles[category] || 'Movies';
}

// Initialize on load if element exists
if (document.querySelector('#movies .api-placeholder')) {
    fetchMovies('popular');
}