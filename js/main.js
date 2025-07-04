// Repository handling
class RepositoryManager {
    constructor() {
        this.page = 1;
        this.loading = false;
        this.hasMore = true;
        this.repositories = [];
        this.repoList = document.getElementById('repo-list');
        this.loadMoreButton = document.getElementById('load-more');
        
        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => this.loadMore());
        }

        // Add error handling for missing elements
        if (!this.repoList) {
            console.error('Repository list element not found');
            return;
        }
    }

    async fetchRepositories() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        this.showLoading();

        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=user:rsergio07+topic:portfolio&page=${this.page}&per_page=6`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.items || !Array.isArray(data.items)) {
                throw new Error('Invalid response format');
            }

            this.repositories = [...this.repositories, ...data.items];
            this.hasMore = data.items.length === 6;
            this.page += 1;
            
            this.displayRepos();
            this.updateLoadMoreButton();
        } catch (error) {
            this.showError(error);
            console.error('Error fetching repository data:', error);
        } finally {
            this.loading = false;
        }
    }

    showLoading() {
        if (this.page === 1) {
            this.repoList.innerHTML = '<div class="loading">Loading repositories</div>';
        }
    }

    showError(error) {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.innerHTML = `
            <p>Unable to fetch repositories at this time.</p>
            <p>Error: ${error.message}</p>
            <button onclick="window.location.reload()">Try Again</button>
        `;
        this.repoList.innerHTML = '';
        this.repoList.appendChild(errorMessage);
    }

    displayRepos() {
        if (this.page === 1) {
            this.repoList.innerHTML = '';
        }

        if (this.repositories.length === 0) {
            this.repoList.innerHTML = '<div class="no-repos">No repositories found with the "portfolio" topic.</div>';
            return;
        }

        this.repositories.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');
            repoCard.innerHTML = `
                <h3>
                    <a href="${repo.html_url}" 
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="View ${repo.name} repository">
                        ${repo.name}
                    </a>
                </h3>
                <p>${repo.description || "No description provided."}</p>
                <p class="repo-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🔄 ${repo.forks_count}</span>
                </p>
            `;
            this.repoList.appendChild(repoCard);
        });
    }

    updateLoadMoreButton() {
        if (this.loadMoreButton) {
            this.loadMoreButton.disabled = !this.hasMore;
            this.loadMoreButton.textContent = this.hasMore ? 'Load More' : 'No More Repositories';
        }
    }

    async loadMore() {
        await this.fetchRepositories();
    }
}

// Initialize the repository manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing RepositoryManager');
    const repoManager = new RepositoryManager();
    repoManager.fetchRepositories();
});

// Add console logging for debugging
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e);
});