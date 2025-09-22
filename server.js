const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((request, response) => {
    console.log('request', request.url);

    const [rawPath] = request.url.split('?');
    const sanitizedPath = rawPath === '/' ? 'index.html' : rawPath.replace(/^\/+/, '').replace(/(\.\.[\\/]+)/g, '') || 'index.html';
    const filePath = path.join(__dirname, sanitizedPath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end('<h1>404 - Fichier non trouvé</h1>');
            } else {
                response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
            return;
        }

        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running at http://127.0.0.1:${PORT}/`);
    });
}

module.exports = server;
