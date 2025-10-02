# 🏠 Alora - Your Home Service Partner

A comprehensive home services platform built with modern technologies, connecting customers with professional service providers.

## 🚀 Quick Start

### Prerequisites
- Node.js (>=16.0.0)
- npm (>=8.0.0)
- MongoDB (local or cloud)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/alorahs/alora.git
   cd alora
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   
   Create `.env` file in the `backend` folder:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/alora
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   ACCESS_TOKEN_EXPIRY=1h
   REFRESH_TOKEN_EXPIRY=7d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Client Configuration
   CLIENT_URL=http://localhost:8000
   PORT=5000
   ```

4. **Start the application**
   ```bash
   npm start
   # or
   npm run dev
   ```

   This will start both:
   - **Backend API**: http://localhost:5000
   - **Frontend App**: http://localhost:8000

## 🏗️ Project Architecture

### Technology Stack

**Frontend**
- ⚛️ React 18 with TypeScript
- ⚡ Vite for fast development
- 🎨 Tailwind CSS + shadcn/ui
- 🔄 React Router for navigation
- 📊 TanStack Query for state management
- 🔌 Socket.IO for real-time features

**Backend**
- 🟢 Node.js + Express.js
- 🍃 MongoDB + Mongoose ODM
- 🔐 JWT Authentication
- 📧 Nodemailer for emails
- 🔌 Socket.IO for real-time communication
- 📁 Multer for file uploads

### Project Structure

```
alora/
├── 🔧 backend/           # Node.js API server
│   ├── models/          # MongoDB models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── config/          # Configuration
├── 🎨 myapp/            # React frontend
│   └── src/
│       ├── shared/      # Shared utilities & components
│       ├── features/    # Feature-based organization
│       ├── components/  # Global components
│       ├── pages/       # Page components
│       └── hooks/       # Custom hooks
└── 📋 docs/             # Documentation
```

## 🎯 Features

### ✅ Implemented Features

- 🔐 **Authentication System**: JWT-based auth with email verification
- 👥 **Multi-role Support**: Customer, Professional, Admin roles
- 📅 **Booking System**: Complete booking workflow with calendar
- ⭐ **Review & Rating**: Customer feedback system
- 🔔 **Real-time Notifications**: Socket.IO based notifications
- ❤️ **Favorites System**: Save preferred professionals
- 🔍 **Advanced Search**: Filter by category, price, location, rating
- 👨‍💼 **Professional Dashboard**: Booking management for professionals
- 🛠️ **Admin Panel**: Complete admin control panel
- 📱 **Responsive Design**: Mobile-first responsive UI

### 🎨 UI/UX Features

- 🌓 Dark/Light theme support
- 📱 Mobile-responsive design
- 🎯 Intuitive navigation
- ⚡ Fast loading with optimizations
- 🎨 Modern design with shadcn/ui components

## 📊 API Documentation

The platform provides a comprehensive REST API with 30+ endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Booking System
- `GET /api/booking` - Get user bookings
- `POST /api/booking` - Create new booking
- `PUT /api/booking/{id}/status` - Update booking status
- `PUT /api/booking/{id}/rating` - Add booking rating

### Professional Services
- `GET /api/_/users` - Get professionals (public)
- `GET /api/services` - Get all services
- `POST /api/favorite` - Add to favorites

[📚 Full API Documentation](./API_ENDPOINTS_CHECK.md)

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start both frontend & backend
npm run frontend     # Start only frontend
npm run backend      # Start only backend

# Building
npm run build        # Build frontend for production
npm run lint         # Lint frontend code
npm run type-check   # TypeScript type checking

# Maintenance
npm run install-all  # Install all dependencies
npm run clean        # Clean node_modules
npm run migrate      # Run project migration script
```

### Code Quality

The project follows modern development practices:

- 📝 **TypeScript** for type safety
- 🎨 **ESLint + Prettier** for code formatting
- 🏗️ **Feature-based architecture** for scalability
- 🔄 **Service layer pattern** for API management
- 📋 **Consistent naming conventions**

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/alora
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:8000
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📋 Available Services

- 🔧 **Plumbing** - Pipe repairs, installations
- ⚡ **Electrical** - Wiring, appliance repairs
- 🧹 **Cleaning** - Home and office cleaning
- 🔨 **Carpentry** - Furniture and woodwork
- 🎨 **Painting** - Interior and exterior painting
- ❄️ **AC Repair** - Air conditioning services
- 🔧 **Appliance Repair** - Home appliance fixes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: Alora Tech Team
- **Project Lead**: [Your Name]
- **Contact**: contact@alora.com

## 🔗 Links

- 🌐 **Live Demo**: [Coming Soon]
- 📚 **Documentation**: [Project Docs](./docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/alorahs/alora/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/alorahs/alora/discussions)

---

<div align="center">
  <p>Made with ❤️ by the Alora Team</p>
  <p>🏠 <strong>Your Home Service Partner</strong> 🏠</p>
</div>