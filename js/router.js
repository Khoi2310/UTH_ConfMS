// ================= ROUTES CONFIGURATION =================
// Each route points to an HTML page that can bring its own CSS via <link> tags in <head>.
const routes = {
    '/': { title: 'Dashboard', file: './pages/dashboard.html' },
    '/login': { title: 'Login', file: './pages/login.html' },
    '/dashboard': { title: 'Dashboard', file: './pages/dashboard.html' },
    '/users': { title: 'Users', file: './pages/users.html' },
    '/conference': { title: 'Conference / CFP', file: './pages/conference.html' },
    '/submissions': { title: 'Submissions', file: './pages/submissions.html' },
    '/program-committee': { title: 'Program Committee', file: './pages/program-committee.html' },
    '/assign-review': { title: 'Assign & Review', file: './pages/Assign-Review/assign-review.html' },
    '/assign-review/scores': { title: 'Scores & Comments', file: './pages/Assign-Review/assign-review-scores.html' },
    '/assign-review/discussion': { title: 'Internal Discussion', file: './pages/Assign-Review/assign-review-discussion.html' },
    '/assign-review/rebuttal': { title: 'Rebuttal (Optional)', file: './pages/Assign-Review/assign-review-rebuttal.html' },
    '/decisions': { title: 'Decisions', file: './pages/decisions.html' },
    '/camera-ready': { title: 'Camera-ready', file: './pages/camera-ready.html' },
    '/reports': { title: 'Reports & Analytics', file: './pages/reports.html' },
    '/settings': { title: 'Settings', file: './pages/settings.html' }
};

// ================= ROUTER CLASS =================
class Router {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.currentRoute = null;
        
        // Initialize router
        this.init();
    }
    
    init() {
        // Listen for hash change events (for hash-based routing)
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }
    
    async navigate(path) {
        // Normalize path - ensure it starts with /
        let normalizedPath = path;
        if (!normalizedPath.startsWith('/')) {
            normalizedPath = '/' + normalizedPath;
        }
        
        // Use hash-based routing to avoid server 404 errors on reload
        const hashPath = '#' + normalizedPath;
        
        // Update URL hash without reload
        if (window.location.hash !== hashPath) {
            window.location.hash = hashPath;
        } else {
            // If hash is already correct, just load the route
            await this.loadRoute(normalizedPath);
        }
    }
    
    async handleRoute() {
        // Use hash-based routing
        let path = window.location.hash.slice(1) || '/';
        
        // Normalize path - ensure it starts with / and remove trailing slashes
        if (path !== '/') {
            path = '/' + path.replace(/^\/+|\/+$/g, '');
        }
        
        await this.loadRoute(path);
    }
    
    async loadRoute(path) {
        // Normalize path
        const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
        
        // Get route from config
        const route = routes[normalizedPath] || routes['/'];
        const routeFile = route.file;
        
        if (this.currentRoute === routeFile) {
            // Already loaded, but still resync header/sidebar (useful when iframes reload)
            this.syncRouteUI(normalizedPath, route.title);
            return;
        }
        
        this.currentRoute = routeFile;
        
        try {
            // Show loading state
            if (this.container) {
                this.container.innerHTML = '<div class="loading-spinner">Đang tải...</div>';
            }
            
            // Fetch and load content
            const response = await fetch(routeFile);
            if (!response.ok) {
                throw new Error(`Failed to load: ${routeFile}`);
            }
            
            const html = await response.text();
            
            // Extract body content and head resources from the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            
            // First, remove page-specific CSS from previous route (keep only global CSS)
            // Global CSS: index.css, header.css, sidebar.css, and external URLs
            const existingCSSLinks = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'));
            const globalCSSPatterns = ['index.css', 'header.css', 'sidebar.css'];
            const pageSpecificCSS = existingCSSLinks.filter(link => {
                const href = link.getAttribute('href') || '';
                // Keep external URLs (CDN, fonts, etc.)
                if (href.match(/^(https?:|\/\/)/)) {
                    return false;
                }
                // Keep global CSS files
                const isGlobal = globalCSSPatterns.some(pattern => 
                    href.toLowerCase().includes(pattern.toLowerCase())
                );
                return !isGlobal;
            });
            
            // Remove page-specific CSS
            pageSpecificCSS.forEach(link => {
                link.remove();
            });
            
            // Extract and inject CSS links from head
            const cssLinks = doc.head.querySelectorAll('link[rel="stylesheet"]');
            cssLinks.forEach(link => {
                const href = link.getAttribute('href');
                
                // Skip index.css, header.css, sidebar.css as they're already loaded globally
                if (href && (href.includes('index.css') || href.includes('header.css') || href.includes('sidebar.css'))) {
                    return;
                }
                
                // Resolve relative CSS paths to absolute paths from project root
                // This is needed because CSS is injected into index.html (root), not the page HTML
                let resolvedHref = href;
                
                // Skip external URLs (http://, https://, //, or absolute paths starting with /)
                if (!href.match(/^(https?:|\/\/|\/)/)) {
                    // Extract CSS filename from path (handles ../Css/file.css, ./Css/file.css, Css/file.css)
                    const cssFilename = href.split('/').pop();
                    
                    // All CSS files are in ./Css/ from project root
                    // So we always resolve to ./Css/filename.css
                    if (cssFilename && cssFilename.endsWith('.css')) {
                        resolvedHref = './Css/' + cssFilename;
                    } else {
                        // Fallback: try to resolve using URL constructor
                        try {
                            const routeBase = new URL(routeFile, window.location.href);
                            const routeDir = routeBase.href.substring(0, routeBase.href.lastIndexOf('/') + 1);
                            const resolvedUrl = new URL(href, routeDir);
                            const rootUrl = new URL('.', window.location.href);
                            resolvedHref = resolvedUrl.href.replace(rootUrl.href, './');
                        } catch (e) {
                            console.warn('Could not resolve CSS path:', href, e);
                            // Keep original href as fallback
                        }
                    }
                }
                
                // Normalize path for comparison (case-insensitive for CSS folder)
                const normalizePath = (path) => {
                    // Normalize Css/css to Css for comparison
                    let normalized = path.replace(/\/css\//gi, '/Css/');
                    if (normalized.startsWith('./')) return normalized;
                    if (normalized.startsWith('../')) return normalized;
                    if (!normalized.startsWith('/') && !normalized.match(/^(https?:|\/\/)/)) {
                        return './' + normalized;
                    }
                    return normalized;
                };
                
                const normalizedResolved = normalizePath(resolvedHref);
                
                // Check if this CSS is already loaded (case-insensitive comparison)
                const existingLink = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
                    .find(link => {
                        const existingHref = link.getAttribute('href');
                        return normalizePath(existingHref).toLowerCase() === normalizedResolved.toLowerCase();
                    });
                
                if (!existingLink) {
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = resolvedHref;
                    document.head.appendChild(newLink);
                }
            });
            
            // Inject content into container
            if (this.container) {
                // Clear container first
                this.container.innerHTML = '';
                
                // Create a temporary div to parse the body content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = bodyContent;
                
                // Extract scripts first before moving nodes
                const scripts = Array.from(tempDiv.querySelectorAll('script'));
                const scriptData = scripts.map(script => ({
                    src: script.src,
                    content: script.textContent || script.innerHTML || '',
                    attributes: Array.from(script.attributes).map(attr => ({
                        name: attr.name,
                        value: attr.value
                    }))
                }));
                
                // Remove scripts from tempDiv to prevent auto-execution
                scripts.forEach(script => script.remove());
                
                // Move all nodes from tempDiv to container (without scripts)
                while (tempDiv.firstChild) {
                    this.container.appendChild(tempDiv.firstChild);
                }
                
                // Now execute scripts manually, one by one
                scriptData.forEach(scriptInfo => {
                    try {
                        const newScript = document.createElement('script');
                        
                        // Copy attributes
                        scriptInfo.attributes.forEach(attr => {
                            newScript.setAttribute(attr.name, attr.value);
                        });
                        
                        if (scriptInfo.src) {
                            // External script
                            newScript.src = scriptInfo.src;
                            this.container.appendChild(newScript);
                        } else if (scriptInfo.content.trim()) {
                            // Inline script - check if already wrapped
                            const trimmed = scriptInfo.content.trim();
                            const isWrapped = trimmed.startsWith('(function') || 
                                             trimmed.startsWith('!function') ||
                                             (trimmed.includes('(function') && trimmed.includes('})();'));
                            
                            if (isWrapped) {
                                // Already wrapped, use as-is
                                newScript.textContent = scriptInfo.content;
                            } else {
                                // Wrap in IIFE
                                newScript.textContent = `(function() { 'use strict'; ${scriptInfo.content} })();`;
                            }
                            
                            this.container.appendChild(newScript);
                        }
                    } catch (error) {
                        console.error('Error executing script:', error, scriptInfo);
                    }
                });
            }

            // Sync route state to iframes (header/sidebar)
            this.syncRouteUI(normalizedPath, route.title);
            
        } catch (error) {
            console.error('Route loading error:', error);
            if (this.container) {
                this.container.innerHTML = `
                    <div class="error-message">
                        <h3>Không thể tải trang</h3>
                        <p>${error.message}</p>
                        <button onclick="if(window.router) window.router.navigate('/')">Về trang chủ</button>
                    </div>
                `;
            }
        }
    }

    syncRouteUI(path, title) {
        const sidebarFrame = document.getElementById('sidebarFrame');
        const headerFrame = document.getElementById('headerFrame');

        if (sidebarFrame?.contentWindow) {
            sidebarFrame.contentWindow.postMessage(
                { type: 'UPDATE_ACTIVE_ROUTE', payload: path },
                '*'
            );
        }

        if (headerFrame?.contentWindow) {
            headerFrame.contentWindow.postMessage(
                { type: 'UPDATE_HEADER_TITLE', payload: title },
                '*'
            );
        }
    }
    
}

// ================= EXPORT ROUTER INSTANCE =================
let router = null;

// Initialize router when DOM is ready
function initRouter() {
    const container = document.querySelector('.content-container');
    if (container) {
        router = new Router('.content-container');
        window.router = router;
    } else {
        // Retry if container not ready yet
        setTimeout(initRouter, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouter);
} else {
    initRouter();
}