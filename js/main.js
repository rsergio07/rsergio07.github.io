class RepositoryManager {
    constructor() {
        this.page = 1;
        this.loading = false;
        this.hasMore = true;
        this.repositories = [];

        this.repoList = document.getElementById('repo-list');
        this.loadMoreButton = document.getElementById('load-more');
        this.loadingDiv = null;

        if (!this.repoList) {
            console.error('Repository list element not found');
            return;
        }

        if (this.loadMoreButton) {
            this.loadMoreButton.style.display = 'none'; // Hide initially
            this.loadMoreButton.addEventListener('click', () => this.loadMore());
        }
    }

    async fetchRepositories() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        this.showLoading();

        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=user:rsergio07+topic:portfolio&sort=updated&order=desc&page=${this.page}&per_page=6`,
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

            this.displayRepos(data.items);
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
            this.repoList.innerHTML = '';
        }

        this.loadingDiv = document.createElement('div');
        this.loadingDiv.classList.add('loading');
        this.loadingDiv.setAttribute('aria-live', 'polite');
        this.loadingDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Loading repositories...</span>
            </div>
        `;
        this.repoList.appendChild(this.loadingDiv);
    }

    removeLoading() {
        if (this.loadingDiv && this.repoList.contains(this.loadingDiv)) {
            this.repoList.removeChild(this.loadingDiv);
        }
    }

    showError(error) {
        this.removeLoading();
        this.repoList.innerHTML = '';

        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.setAttribute('aria-live', 'assertive');
        errorMessage.innerHTML = `
            <p>Unable to fetch repositories at this time.</p>
            <p>Error: ${error.message}</p>
        `;

        const retryButton = document.createElement('button');
        retryButton.classList.add('retry-button');
        retryButton.setAttribute('aria-label', 'Reload the page to try again');
        retryButton.textContent = 'Try Again';
        retryButton.addEventListener('click', () => location.reload());

        errorMessage.appendChild(retryButton);
        this.repoList.appendChild(errorMessage);
    }

    displayRepos(newItems) {
        this.removeLoading();

        // Track already displayed repository names
        const existingRepoNames = new Set(
            Array.from(this.repoList.querySelectorAll('.repo-card h3 a')).map(a => a.textContent.trim())
        );

        let newReposRendered = false;

        newItems.forEach(repo => {
            if (existingRepoNames.has(repo.name)) return; // Skip duplicates

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
            `;
            this.repoList.appendChild(repoCard);
            newReposRendered = true;
        });

        if (!newReposRendered && this.page === 2) {
            this.repoList.innerHTML = '<div class="no-repos">No repositories found with the "portfolio" topic.</div>';
        }
    }

    updateLoadMoreButton() {
        if (this.loadMoreButton) {
            this.loadMoreButton.style.display = this.hasMore ? 'block' : 'none';
            this.loadMoreButton.disabled = !this.hasMore;
            this.loadMoreButton.textContent = this.hasMore ? 'Load More' : 'No More Repositories';
        }
    }

    async loadMore() {
        await this.fetchRepositories();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing RepositoryManager');
    const repoManager = new RepositoryManager();
    repoManager.fetchRepositories();
});

// Catch unexpected JavaScript errors
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e);
});
