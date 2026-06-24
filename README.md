# 🤖 MadiOps — IA Conseil d'Investissement

Application React + Supabase + Groq/Llama déployée sur **Vercel**.

## 🚀 Déploiement rapide sur Vercel via GitHub

### 1. Pusher sur GitHub
```bash
git init
git add .
git commit -m "MadiOps finale"
git branch -M main
git remote add origin https://github.com/alphabechirdiallo-netizen/Madi.git
git push --force -u origin main
```

### 2. Importer sur Vercel
1. Aller sur https://vercel.com/new
2. **Import Git Repository** → sélectionner `madiops`
3. Framework détecté automatiquement : **Vite**
4. Ajouter les **variables d'environnement** :

| Nom | Valeur |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://ufwpbeaiokjzrzgyrbda.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(voir .env.example)* |

5. Cliquer **Deploy** → votre URL `madiops.vercel.app` apparaît

### 3. Configurer Supabase après déploiement
Dans Supabase → **Authentication → URL Configuration** :
- **Site URL** : `https://madiops.vercel.app`
- **Redirect URLs** : `https://madiops.vercel.app/**`

### 4. Clé Groq (OBLIGATOIRE pour que l'IA réponde)
Supabase → **Settings → Edge Functions → Secrets** → ajouter :
```
GROQ_API_KEY = votre_clé_groq
```
Obtenir une clé gratuite sur https://console.groq.com

### 5. Activer les providers OAuth
Supabase → **Authentication → Providers** → activer Google, Azure, Apple
(voir MADIOPS_BACKEND_SETUP.md pour les instructions détaillées)

---

## 🏗️ Architecture
- **Frontend** : React 18 + Vite + Framer Motion
- **Backend** : Supabase Edge Functions (Deno)
- **LLM** : Groq Cloud — `llama-3.3-70b-versatile`
- **Auth** : Supabase Auth (Google, Microsoft, Apple, Email)
- **DB** : PostgreSQL Supabase avec RLS complet
- **Déploiement** : Vercel
