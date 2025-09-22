const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const server = require('../server');

async function makeRequest(port, path) {
    return new Promise((resolve, reject) => {
        const req = http.request(
            {
                hostname: '127.0.0.1',
                port,
                path,
                method: 'GET',
            },
            (res) => {
                let data = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        body: data,
                        headers: res.headers,
                    });
                });
            }
        );

        req.on('error', reject);
        req.end();
    });
}

test('HTTP server responses', async (t) => {
    const serverInstance = server.listen(0);
    await once(serverInstance, 'listening');
    const address = serverInstance.address();
    const port = typeof address === 'string' ? 80 : address.port;

    t.after(() =>
        new Promise((resolve, reject) => {
            serverInstance.close((err) => (err ? reject(err) : resolve()));
        })
    );

    await t.test('serves the index page', async () => {
        const response = await makeRequest(port, '/');
        assert.equal(response.statusCode, 200);
        assert.match(response.body, /<!DOCTYPE html>/i);
        assert.match(response.headers['content-type'], /text\/html/);
    });

    await t.test('returns 404 for unknown paths', async () => {
        const response = await makeRequest(port, '/does-not-exist');
        assert.equal(response.statusCode, 404);
        assert.match(response.body, /404/i);
        assert.match(response.headers['content-type'], /text\/html/);
    });

    await t.test('rejects path traversal attempts', async () => {
        const response = await makeRequest(port, '/../server.js');
        assert.equal(response.statusCode, 403);
        assert.match(response.body, /Accès refusé/);
    });
});
