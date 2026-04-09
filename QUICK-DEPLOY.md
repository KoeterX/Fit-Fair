# Snelle Deployment Guide

## Optie 1: Render (Gratis & Makkelijk)

### Stap 1: GitHub Repository
1. Upload alle bestanden naar GitHub
2. Zet repository op "Public"

### Stap 2: Deploy naar Render
1. Ga naar [render.com](https://render.com)
2. Maak gratis account aan
3. Klik "New +" -> "Web Service"
4. Connect je GitHub repository
5. Configureer:
   - **Name**: knorrie-porrie
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Klik "Create Web Service"
7. Wacht op deployment (2-3 minuten)

### Stap 3: Testen!
- Je krijgt een URL zoals `knorrie-porrie.onrender.com`
- Open de URL in meerdere tabs
- Test video chat!

---

## Optie 2: Railway (Gratis & Makkelijk)

### Stap 1: GitHub Repository
1. Upload bestanden naar GitHub

### Stap 2: Deploy naar Railway
1. Ga naar [railway.app](https://railway.app)
2. Maak account aan
3. Klik "Deploy from GitHub repo"
4. Selecteer je repository
5. Configureer:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Deploy!

---

## Optie 3: Heroku (Gratis Tier)

### Stap 1: GitHub Repository
1. Upload bestanden naar GitHub

### Stap 2: Deploy naar Heroku
1. Ga naar [heroku.com](https://heroku.com)
2. Maak gratis account aan
3. Klik "Create new app"
4. Connect GitHub repository
5. Configureer:
   - **Buildpacks**: Node.js
   - **Start Command**: `npm start`
6. Deploy!

---

## Optie 4: VPS (Volledige controle)

### DigitalOcean (5$ maand)
```bash
# 1. Maak droplet aan
# 2. SSH naar server
ssh root@server-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repository
git clone <github-url>
cd knorrie-porrie

# 5. Install dependencies
npm install

# 6. Start server
npm start
```

---

## Testen na Deployment

### Local Test (Eerst proberen)
```bash
# 1. Ga naar je project folder
cd knorrie-porrie

# 2. Install dependencies
npm install

# 3. Start server
npm start

# 4. Open browser
http://localhost:3000

# 5. Test met meerdere tabs!
```

### Online Test
1. Open deployment URL
2. Open in 2+ browser tabs
3. Klik "Live Chat" in elke tab
4. Wacht op matching
5. **Zie elkaar live!**

---

## Problemen & Oplossingen

### Camera werkt niet?
- **HTTPS vereist** - Render/Railway geven automatisch HTTPS
- **Geef permissie** in browser

### Geen andere gebruikers?
- **Open meerdere tabs** op zelfde URL
- **Vraag vrienden** om te testen

### Deployment mislukt?
- **Check logs** in hosting dashboard
- **Check GitHub** repository is public
- **Retry deployment**

---

## Snelste Manier

**Render is de makkelijkste:**
1. GitHub uploaden (2 min)
2. Render deploy (3 min)
3. Testen (1 min)

**Totaal: 6 minuten voor live video chat!**

---

**Klaar? Kies je hosting provider en volg de stappen!**
