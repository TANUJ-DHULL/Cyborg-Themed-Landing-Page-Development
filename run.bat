@echo off
echo ===================================================
echo   NEXUS-9 CYBORG PORTAL // INITIALIZING LAUNCH
echo ===================================================
echo.
echo [INFO] Directing link to http://localhost:8080/
echo [INFO] Initializing Node.js static server...
echo.

:: Open browser
start http://localhost:8080/

:: Start inline Node server
node -e "const http = require('http'), fs = require('fs'), path = require('path'); const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' }; http.createServer((req, res) => { let fp = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url); fs.readFile(fp, (err, data) => { if (err) { res.writeHead(404); res.end('File Not Found'); } else { res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' }); res.end(data); } }); }).listen(8080, () => console.log('[SUCCESS] Port 8080 is online. Press Ctrl+C to terminate server.'));"
