const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 80;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
};

const server = http.createServer((req, res) => {
    let requestedUrl = decodeURIComponent(req.url);
    console.log(`Requested URL: ${requestedUrl}`);
    let filePath;

    if (requestedUrl === '/') {
        filePath = path.join(__dirname, 'HTML', 'landing.html');
    } else {
        filePath = path.join(__dirname, requestedUrl);
    }

    // Append '.html' if there's no extension in the requested URL
    if (!path.extname(filePath)) {
        filePath += '.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found, serve 404.html
                fs.readFile(path.join(__dirname, 'HTML', '404.html'), (error404, content404) => {
                    if (error404) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content404, 'utf-8');
                    }
                });
            } else {
                // Some server error
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            // Serve the file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
