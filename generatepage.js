const fs = require('fs');
const path = require('path');

const pluginsDir = './plugins';
const outputDir = './docs/plugins';  // GitHub Pages directory
const mainListPath = './docs/index.html';  // Main list of plugins

// Function to generate the plugin HTML page
function generatePluginPage(pluginName, properties) {
    const pluginDir = path.join(pluginsDir, pluginName);
    const outputPluginDir = path.join(outputDir, pluginName);

    if (!fs.existsSync(outputPluginDir)) {
        fs.mkdirSync(outputPluginDir, { recursive: true });
    }

    const pluginPageContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${properties.name}</title>
    </head>
    <body>
        <h1>${properties.name}</h1>
        <p><strong>Version:</strong> ${properties.version}</p>
        <p><strong>Author:</strong> ${properties.author}</p>
        <p><strong>Compatible Versions:</strong> ${properties.compatibleVersions.join(', ')}</p>
        <p><strong>Original Version:</strong> ${properties.originalVersion}</p>
        <p><strong>Description:</strong> ${properties.description}</p>
        <a href="./plugin.py" download="plugin.py">Download plugin.py</a>
    </body>
    </html>
    `;

    fs.writeFileSync(path.join(outputPluginDir, 'index.html'), pluginPageContent);
    fs.copyFileSync(path.join(pluginDir, 'plugin.py'), path.join(outputPluginDir, 'plugin.py'));
}

// Function to update the main plugin list
function updateMainPluginList(plugins) {
    let listItems = plugins.map(plugin => {
        return `<li><a href="./plugins/${plugin}/">${plugin}</a></li>`;
    }).join('\n');

    const mainListContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Approved Plugins</title>
    </head>
    <body>
        <h1>Approved Plugins</h1>
        <ul>
            ${listItems}
        </ul>
    </body>
    </html>
    `;

    fs.writeFileSync(mainListPath, mainListContent);
}

// Main process
fs.readdirSync(pluginsDir).forEach(pluginName => {
    const propertiesPath = path.join(pluginsDir, pluginName, 'properties.json');

    if (fs.existsSync(propertiesPath)) {
        const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
        generatePluginPage(pluginName, properties);
    }
});

const plugins = fs.readdirSync(pluginsDir).filter(pluginName => {
    return fs.existsSync(path.join(pluginsDir, pluginName, 'properties.json'));
});

updateMainPluginList(plugins);
