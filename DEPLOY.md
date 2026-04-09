# Deployment Guide

## GitHub Pages (Static Only)

**Let op**: GitHub Pages ondersteunt geen server-side code, dus alleen de frontend werkt (geen echte video chat).

### Upload naar GitHub Pages
1. Upload alle bestanden naar GitHub repository
2. Ga naar Settings -> Pages
3. Selecteer "Deploy from a branch"
4. Kies main branch en /root folder
5. Site wordt live op `username.github.io/repository`

**Resultaat**: Website werkt maar video chat heeft geen server.

## Full Deployment (Met Video Chat)

### Optie 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create knorrie-porrie

# Deploy
git push heroku main
```

### Optie 2: VPS (DigitalOcean, Vultr, etc.)
```bash
# SSH naar server
ssh root@server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <repository-url>
cd knorrie-porrie

# Install dependencies
npm install

# Start server met PM2
npm install -g pm2
pm2 start server.js --name "knorrie-porrie"
pm2 startup
pm2 save
```

### Optie 3: Render
1. Push naar GitHub
2. Ga naar render.com
3. Connect GitHub repository
4. Selecteer "Web Service"
5. Build command: `npm install`
6. Start command: `npm start`

### Optie 4: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

## HTTPS Setup

### Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### Cloudflare (Gratis SSL)
1. Maak Cloudflare account
2. Voeg domein toe
3. Zet nameservers naar Cloudflare
4. Activeer SSL/TLS (Full mode)

## Environment Variables

### Productie .env
```bash
NODE_ENV=production
PORT=3000
DOMAIN=yourdomain.com
```

## Testing Deployment

### Local HTTPS Test
```bash
# Install mkcert
npm install -g mkcert

# Create local certificate
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Start server met HTTPS
node server.js
```

### Mobile Testing
- Test op verschillende devices
- Check camera permissies
- Test network connectivity

## Monitoring

### PM2 Monitoring
```bash
# Status
pm2 status

# Logs
pm2 logs knorrie-porrie

# Restart
pm2 restart knorrie-porrie
```

### Health Check
```bash
# Test server
curl http://localhost:3000

# Test WebSocket
curl -i -N -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     -H "Sec-WebSocket-Key: test" \
     -H "Sec-WebSocket-Version: 13" \
     http://localhost:3000/socket.io/
```

## Troubleshooting

### Common Issues
1. **Camera niet beschikbaar** -> HTTPS vereist
2. **WebSocket verbinding mislukt** -> Check firewall
3. **Server crasht** -> Check logs en restart
4. **Geen gebruikers** -> Promoot je website!

### Debug Commands
```bash
# Check process
ps aux | grep node

# Check ports
netstat -tulpn | grep :3000

# Check logs
tail -f /var/log/nginx/error.log
```

## Scaling

### Multiple Servers
- Use Redis for Socket.IO adapter
- Load balancer setup
- Database for user sessions

### CDN Setup
- CloudFlare for static assets
- CDN for Socket.IO client
- Optimize video streaming

---

**Klaar voor deployment!** Kies je hosting provider en volg de stappen.
