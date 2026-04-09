# Knorrie Porrie - Random Video Chat Platform

![Knorrie Porrie](https://img.shields.io/badge/Knorrie-Porrie-Video%20Chat-orange?style=for-the-badge&logo=video)

**Live video chat met willekeurige gebruikers - zoals Omegle/OmeTV**

## Features

### Real-time Video Chat
- **Random Matching** - Automatisch gekoppeld aan andere gebruikers
- **Live Video** - Ziet elkaar in real-time via WebRTC
- **Audio Chat** - Praten met elkaar via microfoon
- **Text Chat** - Tegelijkertijd berichten sturen
- **Skip Function** - Direct naar volgende gebruiker
- **Peer-to-Peer** - Directe verbinding zonder server tussenkomst

### Design
- **Zwart/Oranje Thema** - Modern en strak design
- **Responsive** - Werkt op desktop en mobile
- **User Friendly** - Eenvoudige interface

## Quick Start

### 1. Clone en Installeer
```bash
git clone <repository-url>
cd knorrie-porrie
npm install
```

### 2. Start de Server
```bash
npm start
```

### 3. Open Browser
```
http://localhost:3000
```

### 4. Start Video Chatten!
1. Klik op "Live Chat"
2. Geef camera/microfoon toegang
3. Wacht op willekeurige gebruiker
4. Begin met chatten!

## Hoe het Werkt

### User Experience
```
User A joins -> User B joins -> Automatische match -> Live video chat
```

### Technologie
- **Frontend**: WebRTC + Socket.IO Client
- **Backend**: Node.js + Express + Socket.IO
- **Video**: Peer-to-Peer WebRTC verbinding
- **Matching**: Real-time WebSocket signaling

## Testen

### Local Testing
1. Open website in **meerdere browser tabs**
2. Of open op **verschillende apparaten**
3. Klik "Live Chat" in elke tab
4. Wacht tot gebruikers gematcht worden
5. **Zie elkaar live!**

### Production Testing
- Deploy naar hosting met HTTPS
- Deel link met vrienden
- Test met echte gebruikers

## Deployment

### Vereisten
- **Node.js** v14+
- **HTTPS** (vereist voor camera toegang)
- **Port 3000** (of andere vrije poort)

### Hosting Opties
- **VPS**: DigitalOcean, Vultr, Linode
- **PaaS**: Heroku, Render, Railway
- **Cloud**: AWS, Google Cloud, Azure

### Environment Variables
```bash
PORT=3000
NODE_ENV=production
```

## API Reference

### Socket.IO Events

#### Client -> Server
- `find-partner` - Zoek naar nieuwe gebruiker
- `signal` - WebRTC signaling data
- `skip` - Slaat huidige gebruiker over
- `chat-message` - Stuur bericht naar partner

#### Server -> Client
- `user-id` - Unieke gebruiker ID
- `partner-found` - Partner gevonden
- `signal` - WebRTC signaling data
- `searching` - Zoeken naar partner
- `partner-skipped` - Partner heeft geskipt
- `partner-disconnected` - Partner is offline
- `chat-message` - Bericht van partner

## Veiligheid

### Privacy
- **Anoniem** - Geen registratie vereist
- **P2P Video** - Video gaat niet via server
- **No Logs** - Geen chat opslag
- **Random IDs** - Gebruikers zijn anoniem

### Beveiliging
- **HTTPS** - Versleutelde verbinding
- **CORS** - Beveiligde cross-origin requests
- **Input Validation** - Gebruiker input wordt gevalideerd

## Troubleshooting

### Camera werkt niet?
- **HTTPS vereist** in production
- **Geef permissie** in browser
- **Check browser** compatibiliteit

### Geen verbinding?
- **Check server** draait op poort 3000
- **Check firewall** blokkeert geen poorten
- **Refresh browser** en probeer opnieuw

### Geen andere gebruikers?
- **Open meerdere tabs** om te testen
- **Vraag vrienden** om te testen
- **Deploy online** voor echte gebruikers

## Browser Compatibiliteit

### Ondersteund
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Vereisten
- **WebRTC** support
- **getUserMedia** API
- **WebSocket** support

## Toekomstige Features

### Versie 2.0
- [ ] User authenticatie
- [ ] Chat filters (interests, location)
- [ ] Report/Block functionaliteit
- [ ] Chat history
- [ ] Mobile app

### Enterprise Features
- [ ] Multi-server support
- [ ] Load balancing
- [ ] Analytics dashboard
- [ ] Custom branding

## Contributie

1. Fork de repository
2. Maak feature branch
3. Push changes
4. Create Pull Request

## License

MIT License - vrij voor commercieel en persoonlijk gebruik

## Support

- **Issues**: GitHub Issues
- **Email**: support@knorrieporrie.nl
- **Discord**: [Kom naar onze Discord](#)

---

**Ready to chat?** Start de server en begin met video chatten! 

*Made with WebRTC, Socket.IO en Node.js*
