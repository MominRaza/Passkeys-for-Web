const http = require('http');

let emails = ['test@example.com'];

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    switch (req.url) {
        case '/check-email':
            if (req.method !== 'POST') {
                res.statusCode = 405;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Method Not Allowed');
                break;
            }
            handleCheckEmail(req, res);
            break;
        case '/signin':
            handleSignin(req, res);
            break;
        case '/signup':
            handleSignup(req, res);
            break;
        default:
            res.end('Hello World');
            break;
    }
});

function handleCheckEmail(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const data = JSON.parse(body);
        const email = data.email.trim();

        if (emails.includes(email)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ exists: true }));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ exists: false }));
        }
    });
}

function handleSignin(req, res) {
    // Handle signin logic here
    res.end('Signin endpoint');
}

function handleSignup(req, res) {
    // Handle signup logic here
    res.end('Signup endpoint');
}

server.listen(3000, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log('Server listening on port 3000');
    }
});
