# Maubin-Routing-AI

An intelligent routing system for Maubin and surrounding areas, built with AI-powered route optimization. This project provides smart navigation solutions to help users find the most efficient routes in the Maubin region of Myanmar.

## 🚀 Features

- **AI-Powered Route Optimization** - Intelligent pathfinding algorithms
- **Real-time Route Suggestions** - Dynamic route recommendations
- **Multi-destination Planning** - Plan routes with multiple stops
- **Local Area Expertise** - Specialized knowledge of Maubin region
- **RESTful API** - Easy integration with other applications
- **Modern Web Interface** - Clean and responsive frontend

## 🏗️ Project Structure

```
Maubin-Routing-AI/
├── README.md
├── .gitignore
├── nextjs-frontend/          # Next.js React frontend
│   └── (frontend code)
└── python-api/              # Flask Python backend
    ├── app.py              # Main Flask application
    ├── requirements.txt    # Python dependencies
    ├── README.md          # API documentation
    └── venv/              # Virtual environment
```

## 🛠️ Technology Stack

### Backend (Python API)
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Python 3.12+** - Programming language

### Frontend (Next.js)
- **Next.js** - React framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

Before running this project, make sure you have:

- **Python 3.8+** installed
- **Node.js 18+** and npm/yarn installed
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/aung-khantkyaw/Maubin-Routing-AI.git
cd Maubin-Routing-AI
```

### 2. Setup Python API

```bash
cd python-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (Git Bash)
source venv/Scripts/activate
# On Windows (Command Prompt)
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask API
python app.py
```

The API will be available at `http://localhost:5000`

### 3. Setup Next.js Frontend

```bash
cd nextjs-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |
| GET | `/api/route` | Get sample route information |
| GET | `/api/routes` | Get all available routes |

### Example API Response

```json
{
  "message": "Available routes",
  "data": [
    {
      "id": 1,
      "name": "Maubin to Yangon",
      "distance": "120 km",
      "estimated_time": "2.5 hours"
    }
  ],
  "count": 1
}
```

## 🌍 Coverage Areas

Current routing coverage includes:

- **Maubin** (Primary hub)
- **Yangon** - Major city connection
- **Pathein** - Regional connection
- **Pyapon** - Local connection
- More areas coming soon...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 🐛 Known Issues

- Route optimization algorithms are in development
- Real-time traffic data integration pending
- Mobile responsiveness improvements needed

## 🔮 Roadmap

- [ ] Advanced AI route optimization
- [ ] Real-time traffic integration
- [ ] Mobile application
- [ ] Voice navigation
- [ ] Offline map support
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aung Khant Kyaw** - *Initial work* - [@aung-khantkyaw](https://github.com/aung-khantkyaw)

## 🙏 Acknowledgments

- Thanks to the Maubin community for local insights
- OpenStreetMap for geographical data
- Flask and Next.js communities for excellent documentation

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/aung-khantkyaw/Maubin-Routing-AI/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

---

**Happy Routing! 🗺️**