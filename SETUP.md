# Setup Instructions

## Quick Start

### Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your Discord bot token
# Get token from: https://discord.com/developers/applications
```

3. **Run the backend:**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run development server:**
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Getting Your Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" section and click "Add Bot"
4. Copy the token and paste it in your `.env` file
5. Enable these Intents:
   - Message Content Intent
   - Server Members Intent
6. Add these OAuth2 scopes: `bot`
7. Add these permissions: `8` (Administrator)
8. Invite the bot to your server using the OAuth2 URL

## Architecture

```
great-creator/
├── backend/           # Python FastAPI + Discord.py
│   ├── app/
│   │   ├── api/       # API routes
│   │   ├── models.py  # Database models
│   │   └── config.py  # Configuration
│   └── main.py        # FastAPI app entry
└── frontend/          # React + TypeScript
    ├── src/
    │   ├── pages/     # Page components
    │   ├── components/# Reusable components
    │   ├── api/       # API client
    │   └── store/     # Zustand stores
    └── vite.config.ts # Vite config
```

## Features

✨ **Beautiful UI** - Dark mode, glassmorphism design
⚡ **Fast & Optimized** - React with lazy loading, efficient API calls
🔐 **Secure** - JWT authentication, secure token handling
🎮 **Full Guild Management**:
  - Create/edit/delete channels
  - Create/edit/delete roles
  - Manage members (ban, kick, etc.)
  - Real-time updates
  - Member statistics

## Environment Variables

```
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DATABASE_URL=sqlite:///./great_creator.db
JWT_SECRET_KEY=your_secret_key
ALLOWED_ORIGINS=http://localhost:3000
```

## Troubleshooting

**Bot not responding?**
- Check if bot is online in Discord
- Verify bot permissions in server
- Check logs for errors

**API connection issues?**
- Ensure backend is running on port 8000
- Check CORS settings in .env
- Verify database file exists

**Frontend won't load?**
- Clear browser cache
- Check console for errors
- Verify API proxy in vite.config.ts

## Next Steps

1. Customize styling in `frontend/tailwind.config.js`
2. Add more features in backend routes
3. Deploy to production (Vercel + Railway recommended)
4. Set up GitHub Actions CI/CD
