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

const PUBLIC_DIR = __dirname;
const DEFAULT_FILE = 'index.html';
const NOT_FOUND_FILE = path.join(PUBLIC_DIR, '404.html');
const FALLBACK_NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>404 - Fichier non trouvé</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 15vh; color: #eee; background: #111; }
        a { color: #7bf; }
    </style>
</head>
<body>
    <h1>404 - Fichier non trouvé</h1>
    <p>Le fichier demandé est introuvable. <a href="/">Retour à l'accueil</a>.</p>
</body>
</html>`;

function resolveFilePath(rawUrl) {
    const [rawPath] = rawUrl.split('?');
    const relativePath = rawPath === '/' ? DEFAULT_FILE : rawPath.replace(/^\/+/, '') || DEFAULT_FILE;
    const normalizedPath = path.normalize(relativePath);

    if (normalizedPath.startsWith('..') || path.isAbsolute(normalizedPath)) {
        return null;
    }

    return path.join(PUBLIC_DIR, normalizedPath);
}

function serveNotFound(response) {
    fs.readFile(NOT_FOUND_FILE, (readError, content) => {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });

        if (!readError) {
            response.end(content);
            return;
        }

        response.end(FALLBACK_NOT_FOUND_HTML);
    });
}

const server = http.createServer((request, response) => {
    console.log('request ', request.url);

    const filePath = resolveFilePath(request.url);
    if (!filePath) {
        response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Accès refusé');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                serveNotFound(response);
            } else if (error.code === 'EISDIR') {
                response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
                response.end('Accès refusé');
            } else {
                response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                response.end(`Erreur serveur: ${error.code}\n`);
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
