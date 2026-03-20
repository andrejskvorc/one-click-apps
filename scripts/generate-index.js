const fs = require('fs');
const path = require('path');

/// <summary>
/// Parses YAML files in the apps directory, extracts metadata, and dynamically 
/// generates an index.html file in the public folder.
/// </summary>
function generateRepositoryPage() {
    // Definiramo putanje na temelju vaše strukture foldera
    const appsDir = path.join(__dirname, '..', 'public', 'v4', 'apps');
    const publicDir = path.join(__dirname, '..', 'public');
    const outputPath = path.join(publicDir, 'index.html');

    // <summary>
    // Initialize the HTML string with the required CSS and structure.
    // </summary>
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
        .app-card { border: 1px solid #eee; border-radius: 8px; padding: 20px; text-align: center; transition: transform 0.2s; background: var(--card-bg); }
        .app-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .app-logo { max-width: 100px; max-height: 100px; width: auto; height: auto; margin-bottom: 15px; }
        .app-title { font-weight: bold; font-size: 1.1rem; margin-bottom: 10px; }
        .app-desc { font-size: 0.9rem; color: #555; }
        code { background: #eee; padding: 2px 6px; border-radius: 4px; color: #d63384; }
        a { color: var(--primary-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
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
    // Read all files from the apps directory
    // </summary>
    if (fs.existsSync(appsDir)) {
        const files = fs.readdirSync(appsDir);

        files.forEach(file => {
            if (file.endsWith('.yml') || file.endsWith('.yaml')) {
                // Extracts "meshcentral-mariadb" from "meshcentral-mariadb.yml"
                const baseName = path.basename(file, path.extname(file));
                const filePath = path.join(appsDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');

                // <summary>
                // Use Regex to extract displayName and description without needing external YAML parsers
                // </summary>
                const nameMatch = fileContent.match(/displayName:\s*'([^']+)'|displayName:\s*"([^"]+)"|displayName:\s*([^\n]+)/);
                const descMatch = fileContent.match(/description:\s*'([^']+)'|description:\s*"([^"]+)"|description:\s*([^\n]+)/);

                const appName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3]).trim() : baseName;
                const appDesc = descMatch ? (descMatch[1] || descMatch[2] || descMatch[3]).trim() : 'No description provided.';

                // Construct relative logo path to match your folder structure
                const logoPath = `v4/logos/${baseName}.png`;

                htmlContent += `
                <div class="app-card">
                    <img src="${logoPath}" alt="${appName}" class="app-logo" onerror="this.src='https://caprover.com/img/logo.png'">
                    <div class="app-title">${appName}</div>
                    <div class="app-desc">${appDesc}</div>
                </div>
                `;
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

    // <summary>
    // Write the generated HTML to public/index.html
    // </summary>
    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    console.log("Successfully generated public/index.html!");
}

generateRepositoryPage();