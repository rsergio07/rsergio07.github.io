# [Sergio Romero - Professional Portfolio](https://rsergio.com/)

Welcome to the repository for my personal portfolio, showcasing my expertise in **Site Reliability Engineering (SRE)**. This project contains the source code for my GitHub Pages site, where I present my professional background, experience, and a dynamic list of public GitHub repositories and Medium articles.

## Features

  - **Social Media Integration**: Link to my LinkedIn profile to access a more comprehensive view of my professional network, and certifications.
  - **About Me**: A section outlining my professional background and experience.
  - **Dynamic GitHub Repositories**: Real-time display of my public repositories using the GitHub API, presented with a "Load More" option for efficient browsing.
  - **Latest Medium Articles**: Fetches and displays recent articles from my Medium.com account, also using a "Load More" feature for concise viewing.
  - **Accessibility & SEO**: Includes skip-to-content navigation, improved focus styles, ARIA labels, and SEO meta tags for better inclusivity and discoverability.
  - **Loading States**: Skeleton screens provide visual feedback while content loads, improving perceived performance.

-----

## Technologies Used

  - **HTML5 & CSS3**: For the structure and styling of the portfolio.
  - **Vanilla JavaScript**: Used to fetch and display dynamic content from GitHub and Medium APIs with modern ES6+ patterns.
  - **GitHub Pages**: Hosting platform for easy access and automatic updates.
  - **GitHub API**: Fetches real-time data on my public repositories filtered by topic tags.
  - **RSS-to-JSON**: Used to securely fetch and display Medium articles from its RSS feed, bypassing CORS limitations.

-----

## How It Works

The portfolio is a static website hosted on [GitHub Pages](https://rsergio07.github.io). It includes an About Me section, links to social media profiles, and dynamically updated sections for both GitHub repositories and Medium articles. Data for these sections is fetched using respective APIs/proxies and presented in a visually appealing card-based format with "Load More" pagination for improved performance and user experience. The site is designed with accessibility and SEO best practices in mind, and its development process is streamlined through automated CI/CD pipelines.

### How to Run Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/rsergio07/rsergio07.github.io.git
    ```
2.  Open the `index.html` file in your browser to view the portfolio.

-----

Thanks for visiting my portfolio\! If you have any questions or feedback, feel free to reach out.