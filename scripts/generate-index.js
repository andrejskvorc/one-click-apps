const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

/// <summary>
/// Scans the original public/v4/apps directory for YAML files, parses them, 
/// and generates the main index.html file in the dist directory for publishing.
/// </summary>
function generateRepositoryPage() {
    // Čitamo iz ORIGINALNOG public foldera gdje su .yml datoteke netaknute
    const appsDir = path.join(__dirname, '..', 'public', 'v4', 'apps');
    // Spremamo u DIST folder koji ide na GitHub Pages
    const outputPath = path.join(__dirname, '..', 'dist', 'index.html');

    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skvorc CapRover One-Click Apps</title>
    <style>
        :root { --primary-color: #0056b3; --bg-color: #f8f9fa; --card-bg: #ffffff; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; background: var(--bg-color); margin: 0; color: #333; }
        header { background: var(--primary-color); color: white; text-align: center; padding: 3rem 1rem; }
        .repo-url { display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 5px; font-family: monospace; font-size: 1.2rem; margin-top: 15px; }
        .container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
        section { background: var(--card-bg); padding: 2rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        h2 { color: var(--primary-color); border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;}
        .app-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .app-card { border: 1px solid #eee; border-radius: 8px; padding: 20px; text-align: center; transition: transform 0.2s; background: var(--card-bg); display: flex; flex-direction: column; align-items: center; }
        .app-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .app-logo { max-width: 100px; max-height: 100px; width: auto; height: auto; margin-bottom: 15px; }
        .app-title { font-weight: bold; font-size: 1.1rem; margin-bottom: 10px; }
        .app-desc { font-size: 0.9rem; color: #555; }
    </style>
</head>
<body>
    <header>
        <h1>Skvorc One-Click Apps</h1>
        <p>Custom third-party repository for CapRover.</p>
        <div class="repo-url">https://oneclickapps.skvorc.dev</div>
    </header>
    <div class="container">
        <section>
            <h2>What is CapRover?</h2>
            <p><strong><a href="https://caprover.com/" target="_blank">CapRover</a></strong> is an extremely easy-to-use app/database deployment and web server manager. It provides a Heroku-like PaaS experience on your own server.</p>
        </section>
        <section>
            <h2>Third party One Click Apps</h2>
            <p>In order to add this repository to your server:</p>
            <ul>
                <li>Login to your CapRover dashboard</li>
                <li>Go to <strong>Apps</strong> > <strong>One-Click Apps/Databases</strong> and scroll down to the bottom</li>
                <li>Under <strong>3rd party repositories:</strong> copy the URL (<code>https://oneclickapps.skvorc.dev</code>) and paste it</li>
                <li>Click <strong>Connect New Repository</strong></li>
            </ul>
        </section>
        <section>
            <h2>Available Applications</h2>
            <div class="app-grid">
    `;

    // <summary>
    // Iterate over V4 YAML files in the PUBLIC directory and build HTML cards
    // </summary>
    if (fs.existsSync(appsDir)) {
        const files = fs.readdirSync(appsDir);

        files.forEach(file => {
            if (file.endsWith('.yml') || file.endsWith('.yaml')) {
                const baseName = path.basename(file, path.extname(file));
                const filePath = path.join(appsDir, file);

                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const parsedYaml = yaml.parse(fileContent);
                    const appData = parsedYaml.caproverOneClickApp || {};

                    const appName = appData.displayName || baseName;
                    const appDesc = appData.description || 'No description provided.';
                    const logoPath = `v4/logos/${baseName}.png`; // Putanja ostaje ista jer se logotipi kopiraju u dist

                    htmlContent += `
                    <div class="app-card">
                        <img src="${logoPath}" alt="${appName}" class="app-logo" onerror="this.src='https://caprover.com/img/logo.png'">
                        <div class="app-title">${appName}</div>
                        <div class="app-desc">${appDesc}</div>
                    </div>
                    `;
                } catch (error) {
                    console.error(`Failed to parse YAML for ${file}:`, error);
                }
            }
        });
    }

    htmlContent += `
            </div>
        </section>
    </div>
</body>
</html>
    `;

    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    console.log("Success: Generated index.html in the dist directory.");
}

generateRepositoryPage();