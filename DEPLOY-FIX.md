# Deploy Fix Instructions

## Probleem: Deploy Failed
- Syntax error in script.js (nu gefixt)
- Deploy failed bij styles.css update

## Oplossing:

### Optie A: Render Dashboard (Aanbevolen)
1. Ga naar je Render dashboard
2. Klik op je "knorrie-porrie" service
3. Klik "Manual Deploy" 
4. Wacht 2-3 minuten
5. Test de website

### Optie B: Git Trigger
```bash
# Push een lege commit om deploy te triggeren
git commit --allow-empty -m "trigger deploy fix"
git push origin main
```

### Optie C: Cache Clear
1. Open je website
2. Druk **Ctrl+F5** (hard refresh)
3. Of **Ctrl+Shift+R** voor cache clear

## Test na Deploy:
1. Open website in **2 browser tabs**
2. Klik "Live Chat" in beide tabs
3. Wacht op matching
4. Check online leden count

## Werkt het nog niet?
1. Check Render logs voor errors
2. Open F12 Console voor JavaScript errors
3. Screenshot en stuur errors

---
**Deploy fix is klaar!**
