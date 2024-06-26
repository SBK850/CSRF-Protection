const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: true,  // Set to true if you're serving your site over HTTPS
        sameSite: 'Strict'  // Adjust this setting based on your requirements
    },
    value: (req) => req.headers['csrf-token']
});

app.use(cors({
    origin: 'https://main.dc5bz0dk3svjz.amplifyapp.com',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/get-csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/process-url', csrfProtection, (req, res) => {
    console.log("CSRF Token from header:", req.headers['csrf-token']);
    console.log("Cookies received:", req.cookies);
    try {
        const { url } = req.body;
        new URL(url);
        console.log('Received valid URL:', url);
        res.status(200).json({ message: 'URL processed successfully' });
    } catch (error) {
        console.error('Error processing URL:', error.message);
        res.status(400).json({ error: 'Invalid URL or processing failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
