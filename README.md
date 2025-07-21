# 🚀 Crypto Trading Platform

A modern, full-stack cryptocurrency trading platform built with React, Node.js, and Three.js featuring real-time 3D visualizations, live market data, and a secure chat system.

## ✨ Features

### 🎨 Frontend
- **Modern UI Design**: Glassmorphism design with smooth animations and transitions
- **3D Visualizations**: Interactive 3D elements powered by Three.js and React Three Fiber
- **Responsive Design**: Mobile-first approach with seamless responsive experience
- **Real-time Charts**: TradingView integration for professional trading charts
- **Live Market Data**: Real-time cryptocurrency market information
- **News Feed**: Latest crypto news with elegant card layouts
- **Web3 Integration**: MetaMask wallet connection support
- **Real-time Chat**: WebSocket-based global chat room

### 🔧 Backend
- **Express.js API**: RESTful API with proper error handling
- **WebSocket Server**: Real-time communication for chat functionality
- **External API Integration**: CoinGecko API for market data, NewsAPI for news
- **Production Ready**: PM2 process management, clustering, and auto-restart
- **Security**: CORS configuration, input validation, and rate limiting
- **Caching**: Response caching for optimal performance
- **Health Monitoring**: Health check endpoints for monitoring

### 🎭 Enhanced UI Features
- **Smooth Animations**: CSS3 and Framer Motion animations
- **3D Particle Systems**: Dynamic particle effects and floating elements
- **Glassmorphism**: Modern glass-like UI components
- **Custom Scrollbars**: Styled scrollbars matching the theme
- **Loading States**: Beautiful loading spinners and skeleton screens
- **Error Handling**: Elegant error states with retry functionality
- **Dark Theme**: Optimized for dark mode viewing

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Firebase** - Authentication and real-time database
- **Ethers.js** - Ethereum wallet integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **WebSocket (ws)** - Real-time communication
- **Axios** - HTTP client for external APIs
- **CORS** - Cross-origin resource sharing
- **PM2** - Production process manager

### APIs & Services
- **CoinGecko API** - Cryptocurrency market data
- **NewsAPI** - Latest crypto news
- **TradingView** - Professional trading charts
- **Firebase** - Authentication & database

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-trading-platform
   ```

2. **Make startup script executable**
   ```bash
   chmod +x start.sh
   ```

3. **Install dependencies and setup environment**
   ```bash
   ./start.sh install
   ./start.sh setup
   ```

4. **Configure environment variables**
   Edit `backend/.env` and add your API keys:
   ```env
   NEWS_API_KEY=your_news_api_key_here
   NODE_ENV=development
   PORT=3001
   ```

5. **Start development servers**
   ```bash
   ./start.sh dev
   ```

   This will start:
   - Backend API server on `http://localhost:3001`
   - Frontend development server on `http://localhost:5173`

## 📋 Available Commands

The `start.sh` script provides several commands:

```bash
./start.sh install    # Install all dependencies
./start.sh setup      # Setup environment files
./start.sh dev        # Start development servers
./start.sh build      # Build frontend for production
./start.sh start      # Start production server
./start.sh stop       # Stop production server
./start.sh restart    # Restart production server
./start.sh logs       # Show production server logs (requires PM2)
./start.sh status     # Show server status (requires PM2)
./start.sh help       # Show help message
```

## 🌐 Production Deployment

### Option 1: Using the Startup Script

1. **Build and start production server**
   ```bash
   ./start.sh build
   ./start.sh start
   ```

2. **For PM2 process management (recommended)**
   ```bash
   npm install -g pm2
   ./start.sh start
   ```

### Option 2: Manual Deployment

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Start backend**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "backend/server.js"]
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# API Keys
NEWS_API_KEY=your_news_api_key_here

# URLs (for production)
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore
3. Update `frontend/src/firebaseConfig.js` with your config

### API Keys Required

- **NewsAPI**: Get your free API key from [NewsAPI](https://newsapi.org/)
- **Firebase**: Get config from Firebase Console

## 📱 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Market Data
- `GET /api/market/coins` - List of cryptocurrencies
- `GET /api/market/chart/:coinId` - Chart data for specific coin

### News
- `GET /api/berita` - Latest crypto news

### WebSocket
- `ws://localhost:3001` - Real-time chat connection

## 🎨 UI Components

### 3D Elements
- **Animated Spheres**: Distortion effects with mouse interaction
- **Particle Systems**: 1000+ floating particles with physics
- **Floating Geometries**: Multiple 3D shapes with independent animations
- **Environment Lighting**: HDR environment maps for realistic lighting

### Animations
- **Staggered Animations**: Sequential element reveals
- **Smooth Transitions**: 60fps CSS3 transitions
- **Hover Effects**: Interactive hover states with scale and glow
- **Loading States**: Skeleton screens and spinners

### Design System
- **CSS Variables**: Consistent theming system
- **Glassmorphism**: Blur effects and transparency
- **Custom Scrollbars**: Styled to match theme
- **Responsive Grid**: CSS Grid with auto-fit columns

## 🔧 Development

### Project Structure
```
├── backend/
│   ├── server.js           # Main server file
│   ├── ecosystem.config.js # PM2 configuration
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── config/         # Configuration files
│   │   └── assets/         # Static assets
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── api/                    # Serverless functions (legacy)
├── start.sh               # Startup script
└── README.md
```

### Adding New Features

1. **API Endpoints**: Add to `backend/server.js`
2. **Frontend Pages**: Create in `frontend/src/pages/`
3. **Components**: Add to `frontend/src/components/`
4. **Styling**: Use CSS modules in respective `.module.css` files

### Performance Optimization

- **Code Splitting**: Automatic with Vite
- **Image Optimization**: WebP format with fallbacks
- **Caching**: API response caching
- **Bundle Analysis**: `npm run build` shows bundle sizes
- **Lazy Loading**: React.lazy for large components

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti :3001 | xargs kill -9
   lsof -ti :5173 | xargs kill -9
   ```

2. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API key errors**
   - Check `.env` file exists in `backend/` directory
   - Verify API keys are valid and active

4. **WebSocket connection failed**
   - Ensure backend server is running
   - Check firewall settings for port 3001

### Performance Issues

1. **Slow 3D rendering**
   - Reduce particle count in HomePage.jsx
   - Lower device pixel ratio in Canvas component

2. **Large bundle size**
   - Check bundle analysis after build
   - Consider code splitting for large dependencies

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all environment variables are properly set
4. Verify API keys are valid and have sufficient quota

## 🔮 Future Enhancements

- [ ] Trading functionality with simulated orders
- [ ] Portfolio tracking and analytics
- [ ] Mobile app with React Native
- [ ] Advanced charting tools
- [ ] Social trading features
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] WebRTC video chat integration
- [ ] Advanced order types (limit, stop-loss)
- [ ] Price alerts and notifications

---

**Built with ❤️ using modern web technologies**