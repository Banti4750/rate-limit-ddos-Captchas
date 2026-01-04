# Rate Limiting, DDoS Protection & CAPTCHA Implementation

A comprehensive hands-on project demonstrating various rate limiting techniques, brute force attack simulation, and CAPTCHA integration to protect web applications from abuse and DDoS attacks.

## 📚 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Implementations](#implementations)
  - [1. Without Rate Limit](#1-without-rate-limit)
  - [2. Express Rate Limit](#2-express-rate-limit)
  - [3. Brute Force Attack Simulation](#3-brute-force-attack-simulation)
  - [4. Cloudflare CAPTCHA Integration](#4-cloudflare-captcha-integration)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Key Learnings](#key-learnings)
- [Security Best Practices](#security-best-practices)
- [Resources](#resources)

## 🎯 Overview

This repository contains four practical implementations that demonstrate the importance of rate limiting and security measures in web applications. Each implementation builds upon the previous one, showing the progression from an unprotected application to a fully secured one with multiple layers of defense.

**Purpose**: To understand and implement various security mechanisms that protect web applications from:
- DDoS (Distributed Denial of Service) attacks
- Brute force attacks
- Automated bot traffic
- Spam and abuse

## 📁 Project Structure

```
rate-limit-ddos-Captchas/
│
├── without-rate-limit/          # Vulnerable application without any protection
│   ├── server.js                # Basic Express server
│   ├── package.json
│   └── public/                  # Frontend files
│
├── express-rate-limit/          # Application with rate limiting
│   ├── server.js                # Server with express-rate-limit middleware
│   ├── package.json
│   └── public/
│
├── brute-force-logic-to-hit-server/  # Attack simulation tool
│   ├── attack.js                # Script to simulate brute force attacks
│   ├── package.json
│   └── config.js                # Attack configuration
│
└── cloudflare_captchas/         # CAPTCHA protected application
    ├── server.js                # Server with Turnstile CAPTCHA
    ├── package.json
    └── public/
        └── index.html           # Frontend with CAPTCHA integration
```

## 🛠 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **express-rate-limit** - Rate limiting middleware
- **Cloudflare Turnstile** - Modern CAPTCHA solution
- **Axios** - HTTP client for making requests
- **HTML/CSS/JavaScript** - Frontend technologies

## 🚀 Implementations

### 1. Without Rate Limit

**Location**: `./without-rate-limit`

A basic Express server with an OTP (One-Time Password) sending functionality, similar to the 100xDevs login page, but without any rate limiting or protection mechanisms.

**Features**:
- Simple OTP request endpoint
- No request throttling
- Vulnerable to abuse
- Demonstrates the need for security measures

**Key Endpoint**:
```javascript
POST /send-otp
Body: { phoneNumber: "1234567890" }
```

**Problem**: 
- Unlimited requests can overwhelm the server
- Attackers can flood the endpoint
- High server costs due to abuse
- SMS/Email service exhaustion

### 2. Express Rate Limit

**Location**: `./express-rate-limit`

Implementation of rate limiting using the `express-rate-limit` middleware to protect the OTP endpoint from abuse.

**Features**:
- Request throttling per IP address
- Configurable time windows
- Customizable response messages
- Memory-based storage (can be extended to Redis)

**Configuration Example**:
```javascript
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many OTP requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/send-otp', otpLimiter, (req, res) => {
  // OTP sending logic
});
```

**Benefits**:
- Prevents excessive requests from single IP
- Reduces server load
- Cost-effective protection
- Easy to implement and configure

### 3. Brute Force Attack Simulation

**Location**: `./brute-force-logic-to-hit-server`

A script that simulates brute force attacks to test the effectiveness of rate limiting implementations. This demonstrates how attackers might attempt to overwhelm a system.

**Features**:
- Concurrent request flooding
- Configurable attack parameters
- Different attack patterns (sequential, concurrent)
- Performance metrics and logging

**Attack Patterns**:

1. **Sequential Attack**: Sends requests one after another
2. **Concurrent Attack**: Sends multiple requests simultaneously
3. **Distributed Attack**: Simulates requests from multiple IPs (using proxies)

**Usage Example**:
```javascript
// Configuration
const config = {
  targetUrl: 'http://localhost:3000/send-otp',
  numberOfRequests: 100,
  concurrentRequests: 10,
  delayBetweenRequests: 100, // ms
};

// Run attack simulation
node attack.js
```

**Observed Behavior**:
- Without rate limiting: All requests succeed, server overload
- With rate limiting: Requests blocked after threshold, server stable

### 4. Cloudflare CAPTCHA Integration

**Location**: `./cloudflare_captchas`

Implementation of Cloudflare Turnstile CAPTCHA to add an additional layer of human verification before processing sensitive requests.

**Features**:
- Cloudflare Turnstile integration (privacy-friendly CAPTCHA)
- Client-side CAPTCHA rendering
- Server-side token verification
- Combined with rate limiting for robust protection

**Frontend Integration**:
```html
<!-- Add Turnstile script -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- CAPTCHA container -->
<div class="cf-turnstile" 
     data-sitekey="YOUR_SITE_KEY"
     data-callback="onCaptchaSuccess">
</div>
```

**Backend Verification**:
```javascript
const axios = require('axios');

async function verifyCaptcha(token) {
  const response = await axios.post(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }
  );
  
  return response.data.success;
}

app.post('/send-otp', async (req, res) => {
  const { captchaToken, phoneNumber } = req.body;
  
  const isValid = await verifyCaptcha(captchaToken);
  
  if (!isValid) {
    return res.status(400).json({ error: 'CAPTCHA verification failed' });
  }
  
  // Process OTP request
});
```

**Benefits**:
- Blocks automated bots
- User-friendly (no image puzzles)
- Privacy-focused (no tracking)
- Free tier available

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Cloudflare account (for CAPTCHA implementation)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Banti4750/rate-limit-ddos-Captchas.git
cd rate-limit-ddos-Captchas
```

2. **Setup each implementation**

**Without Rate Limit:**
```bash
cd without-rate-limit
npm install
npm start
# Server runs on http://localhost:3000
```

**Express Rate Limit:**
```bash
cd express-rate-limit
npm install
npm start
# Server runs on http://localhost:3001
```

**Brute Force Simulation:**
```bash
cd brute-force-logic-to-hit-server
npm install
# Configure target URL in config.js
node attack.js
```

**Cloudflare CAPTCHA:**
```bash
cd cloudflare_captchas
npm install

# Create .env file
echo "TURNSTILE_SITE_KEY=your_site_key" >> .env
echo "TURNSTILE_SECRET_KEY=your_secret_key" >> .env

npm start
# Server runs on http://localhost:3002
```

3. **Get Cloudflare Turnstile Keys**
- Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
- Navigate to Turnstile
- Create a new site
- Copy Site Key and Secret Key
- Add to `.env` file

## 🎮 Usage

### Testing Without Rate Limit
1. Start the server: `cd without-rate-limit && npm start`
2. Open browser: `http://localhost:3000`
3. Try sending multiple OTP requests rapidly
4. Observe: All requests succeed (vulnerable)

### Testing With Rate Limit
1. Start the server: `cd express-rate-limit && npm start`
2. Open browser: `http://localhost:3001`
3. Try sending multiple OTP requests
4. Observe: After 5 requests, you get rate limited
5. Wait 15 minutes or restart server to reset

### Running Attack Simulation
1. Start one of the servers (with or without rate limit)
2. In another terminal: `cd brute-force-logic-to-hit-server`
3. Configure target in `config.js`
4. Run: `node attack.js`
5. Observe the results in console

### Testing CAPTCHA Protection
1. Start the server: `cd cloudflare_captchas && npm start`
2. Open browser: `http://localhost:3002`
3. Complete the CAPTCHA challenge
4. Submit OTP request
5. Try automated tools (they will fail CAPTCHA)

## 🔑 Key Learnings

### Rate Limiting Concepts

1. **Window Types**:
   - **Fixed Window**: Resets at fixed intervals (e.g., every 15 minutes)
   - **Sliding Window**: Continuously moving time window
   - **Token Bucket**: Requests consume tokens that refill over time

2. **Rate Limit Headers**:
   ```
   X-RateLimit-Limit: 5
   X-RateLimit-Remaining: 3
   X-RateLimit-Reset: 1640000000
   ```

3. **Storage Options**:
   - **Memory Store**: Fast, but resets on server restart
   - **Redis**: Persistent, distributed, recommended for production
   - **Database**: Slower, but integrates with existing infrastructure

### DDoS Protection Layers

```
Layer 1: Network Level (Cloudflare, AWS Shield)
Layer 2: Application Level (Rate Limiting)
Layer 3: Human Verification (CAPTCHA)
Layer 4: Behavioral Analysis (Bot Detection)
```

### Attack Types Demonstrated

1. **Volume-based Attacks**: Overwhelming with requests
2. **Application Layer Attacks**: Targeting specific endpoints
3. **Brute Force**: Repeated attempts to guess credentials
4. **Resource Exhaustion**: Consuming server resources

## 🔒 Security Best Practices

### 1. Implement Multiple Layers
```javascript
// Combine rate limiting + CAPTCHA
app.post('/send-otp', 
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), // Rate limit
  async (req, res) => {
    const captchaValid = await verifyCaptcha(req.body.captchaToken);
    if (!captchaValid) {
      return res.status(400).json({ error: 'Invalid CAPTCHA' });
    }
    // Process request
  }
);
```

### 2. Use Different Limits for Different Endpoints
```javascript
const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3 });
const standardLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.post('/login', strictLimiter, loginHandler);
app.get('/api/data', standardLimiter, dataHandler);
```

### 3. Implement Exponential Backoff
```javascript
const attempts = getAttempts(ip);
const backoffTime = Math.pow(2, attempts) * 1000; // Exponential increase

if (Date.now() < lastAttemptTime + backoffTime) {
  return res.status(429).json({ 
    error: 'Too many attempts',
    retryAfter: backoffTime 
  });
}
```

### 4. Monitor and Alert
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    // Log suspicious activity
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    
    // Alert if threshold crossed
    if (getViolationCount(req.ip) > 10) {
      sendAlert(`Possible attack from ${req.ip}`);
    }
    
    res.status(429).json({ error: 'Too many requests' });
  }
});
```

### 5. Use Environment Variables
```javascript
// .env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
TURNSTILE_SITE_KEY=your_key
TURNSTILE_SECRET_KEY=your_secret

// server.js
require('dotenv').config();

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
});
```

## 📚 Resources

### Documentation
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

### Related Concepts
- Token Bucket Algorithm
- Leaky Bucket Algorithm
- Sliding Window Counter
- Redis for Distributed Rate Limiting
- Bot Detection Techniques

### Further Reading
- DDoS Mitigation Strategies
- Web Application Security
- API Security Best Practices
- Cloudflare Security Features

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Improve documentation
- Add more security implementations

## ⚠️ Disclaimer

This project is for educational purposes only. The brute force attack simulation should only be used on systems you own or have permission to test. Unauthorized testing of security measures on systems you don't own is illegal.

## 📝 License

MIT License - Feel free to use this project for learning and educational purposes.

## 👤 Author

**Banti4750**
- GitHub: [@Banti4750](https://github.com/Banti4750)

---

**⭐ Star this repository if you found it helpful!**

**🔗 Share it with others who want to learn about web security!**
