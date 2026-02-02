# UTH Conference Management System (UTH-ConfMS)

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128%2B-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue.svg)](https://www.postgresql.org/)

A comprehensive conference management system for scientific conferences, providing end-to-end workflow management from paper submission to camera-ready collection and proceedings generation.

## � Quick Start (3 Minutes)

For the fastest way to get started with SQLite:

```bash
# 1. Clone and navigate
git clone https://github.com/yourusername/UTH_ConfMS.git
cd UTH_ConfMS

# 2. Create virtual environment and install dependencies
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt

# 3. Set up environment (SQLite - no database server needed!)
copy .env.example .env         # Windows
# cp .env.example .env         # macOS/Linux

# 4. Run the application
python main.py
```

Visit http://localhost:8000 - Done! 🎉

---

## 📋 Table of Contents

- [Quick Start](#quick-start-3-minutes)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Conference Management**: Create and configure conferences, tracks, deadlines, and templates
- **Paper Submission**: Author dashboard with metadata entry, PDF upload, and revision management
- **Peer Review System**: Double-blind review with scoring, comments, and discussion
- **Program Committee Management**: PC member invitations, conflict of interest (COI) detection, and review assignment
- **Decision Making**: Review aggregation and decision workflow
- **Camera-Ready Collection**: Final version uploads and proceedings generation
- **Role-Based Access Control**: Separate interfaces for Authors, Reviewers, Chairs, and Administrators
- **Audit Logging**: Comprehensive tracking of all system activities
- **AI-Assisted Tools** (Optional): Grammar checking, paper summaries, and reviewer-paper matching

## 🛠 Technology Stack

### Backend
- **Python 3.11+**
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy 2.0**: ORM for database operations
- **PostgreSQL**: Primary database
- **Alembic**: Database migrations
- **Pydantic**: Data validation
- **JWT**: Authentication and authorization

### Frontend
- **HTML5/CSS3/JavaScript**: Core web technologies
- **Jinja2 Templates**: Server-side templating
- **Responsive Design**: Mobile-friendly interface

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11 or higher** - [Download Python](https://www.python.org/downloads/)
- **Git** - [Download Git](https://git-scm.com/downloads/)
- **pip** (usually comes with Python) or **uv** (recommended for faster installation)

### Database Options

Choose one of the following:

**Option 1: SQLite (Recommended for Quick Start)**
- ✅ No installation required (comes with Python)
- ✅ Perfect for development and testing
- ✅ Single file database
- ⚠️ Not recommended for production with high concurrency

**Option 2: PostgreSQL (Recommended for Production)**
- **PostgreSQL 13 or higher** - [Download PostgreSQL](https://www.postgresql.org/download/)
- ✅ Better performance with multiple users
- ✅ Advanced features and scalability
- ✅ Recommended for production deployments

### Optional
- **Redis** - For caching (optional but recommended for production)
- **Node.js** - If you plan to use additional frontend build tools

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/UTH_ConfMS.git
cd UTH_ConfMS
```

### 2. Create a Virtual Environment

**Using venv (built-in):**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**Using uv (faster, recommended):**
```bash
# Install uv if you don't have it
pip install uv

# Create and activate virtual environment
uv venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

### 3. Install Dependencies

**Using pip:**
```bash
pip install -r requirements.txt
```

**Using uv (faster):**
```bash
uv pip install -r requirements.txt
```

**Or using pyproject.toml:**
```bash
pip install -e .
```

### 4. Set Up Database

You have two options:

#### Option A: SQLite (Quick Start - Recommended for Beginners)

**No setup required!** SQLite will automatically create the database file when you first run the application. Just proceed to the next step.

#### Option B: PostgreSQL (Production)

1. **Start PostgreSQL service** (if not already running)

2. **Create the database:**
   ```bash
   # Open PostgreSQL command line
   psql -U postgres
   
   # Create database
   CREATE DATABASE uth_confms;
   
   # Create user (optional, if not using postgres user)
   CREATE USER confms_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE uth_confms TO confms_user;
   
   # Exit psql
   \q
   ```

### 5. Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   # Windows
   copy .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

2. **Edit `.env` file with your configuration:**
   
   **For SQLite (Quick Start):**
   ```env
   # Application
   APP_NAME="UTH Conference Management System"
   APP_VERSION="1.0.0"
   DEBUG=true
   SECRET_KEY=your-secure-random-string-here
   
   # Database - SQLite (file-based, no server needed)
   DATABASE_URL=sqlite:///./uth_confms.db
   
   # JWT Settings - Change these to secure random strings
   JWT_SECRET_KEY=your-jwt-secret-key-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ```
   
   **For PostgreSQL (Production):**
   ```env
   # Application
   APP_NAME="UTH Conference Management System"
   APP_VERSION="1.0.0"
   DEBUG=true
   SECRET_KEY=your-secure-random-string-here
   
   # Database - PostgreSQL
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/uth_confms
   
   # JWT Settings - Change these to secure random strings
   JWT_SECRET_KEY=your-jwt-secret-key-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   REFRESH_TOKEN_EXPIRE_DAYS=7
   
   # Email/SMTP (optional, for email notifications)
   # SMTP_HOST=smtp.gmail.com
   # SMTP_PORT=587
   # SMTP_USER=your-email@gmail.com
   # SMTP_PASSWORD=your-app-password
   # SMTP_FROM_EMAIL=noreply@uth.edu.vn
   
   # File Upload
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE_MB=20
   
   # AI Features (optional)
   AI_ENABLED=false
   # OPENAI_API_KEY=your-openai-api-key
   ```

   **Important:** Generate secure random keys for `SECRET_KEY` and `JWT_SECRET_KEY`:
   ```bash
   # Generate secure keys (Python)
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

### 6. Initialize the Database

The database tables will be automatically created when you first run the application. The `init_db()` function in the startup will handle this.

## ▶️ Running the Application

### Development Mode

**Method 1: Using Python directly**
```bash
python main.py
```

**Method 2: Using uvicorn with auto-reload**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Method 3: Using FastAPI CLI (if fastapi[standard] is installed)**
```bash
fastapi dev main.py
```

The application will start on:
- **Frontend**: http://localhost:8000
- **API**: http://localhost:8000/api/v1
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc (ReDoc)
- **Health Check**: http://localhost:8000/health

### Production Mode

For production deployment:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Or use **Gunicorn** with Uvicorn workers:

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## ⚙️ Configuration

### Environment Variables

All configuration is managed through environment variables in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string<br>SQLite: `sqlite:///./uth_confms.db`<br>PostgreSQL: `postgresql://user:pass@host:5432/dbname` | `postgresql://postgres:postgres@localhost:5432/uth_confms` |
| `SECRET_KEY` | Application secret key | `change-this-in-production` |
| `JWT_SECRET_KEY` | JWT signing key | `jwt-secret-change-in-production` |
| `DEBUG` | Enable debug mode | `false` |
| `UPLOAD_DIR` | Directory for file uploads | `uploads` |
| `MAX_FILE_SIZE_MB` | Maximum file upload size (MB) | `20` |
| `AI_ENABLED` | Enable AI features | `false` |

### Database Migrations (Using Alembic)

If you need to manage database schema changes:

```bash
# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

## 📁 Project Structure

```
UTH_ConfMS/
├── app/
│   ├── api/               # API endpoints
│   │   ├── auth.py        # Authentication endpoints
│   │   ├── conferences.py # Conference management
│   │   ├── papers.py      # Paper submission
│   │   ├── reviews.py     # Review system
│   │   └── pc_members.py  # PC member management
│   ├── core/              # Core functionality
│   │   ├── config.py      # Configuration settings
│   │   ├── database.py    # Database connection
│   │   └── security.py    # Security utilities
│   ├── models/            # SQLAlchemy models
│   └── schemas/           # Pydantic schemas
├── UI/                    # Frontend interface
│   ├── Pages/             # HTML pages
│   ├── Css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── Components/        # Reusable components
│   └── assets/            # Images and icons
├── main.py                # Application entry point
├── requirements.txt       # Python dependencies
├── pyproject.toml         # Project configuration
└── .env                   # Environment variables (create from .env.example)
```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/conferences` - List conferences
- `POST /api/v1/papers` - Submit a paper
- `GET /api/v1/reviews` - Get reviews
- `POST /api/v1/reviews` - Submit a review

## 💻 Development

### Running Tests

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

### Code Formatting

```bash
# Format code with black
black .

# Lint with ruff
ruff check .
```

### Development Tools

- **Hot Reload**: Use `--reload` flag with uvicorn for automatic reloading
- **Debug Mode**: Set `DEBUG=true` in `.env` for detailed error messages
- **Database Inspection**: Use tools like pgAdmin or DBeaver

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Error**

*For PostgreSQL:*
```
Error: could not connect to server
```
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check PostgreSQL service status:
  ```bash
  # Windows
  net start postgresql-x64-13
  
  # macOS
  brew services start postgresql
  
  # Linux
  sudo systemctl start postgresql
  ```

*For SQLite:*
```
Error: unable to open database file
```
- Check that the application has write permissions in the current directory
- Verify the DATABASE_URL format: `sqlite:///./uth_confms.db`
- The database file will be created automatically on first run

**2. Import Errors**
```
ModuleNotFoundError: No module named 'fastapi'
```
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**3. Port Already in Use**
```
Error: [Errno 10048] Only one usage of each socket address
```
- Change the port: `uvicorn main:app --port 8001`
- Or kill the process using the port

**4. Permission Errors with Uploads**
- Ensure the `uploads/` directory exists and has write permissions
- Create manually if needed: `mkdir uploads`

**5. CORS Errors**
- Check that your frontend URL is listed in `allow_origins` in [main.py](main.py#L39-L40)
- Update if accessing from different origin

### Getting Help

- Check the logs in the terminal where the server is running
- Enable DEBUG mode for detailed error messages
- Refer to [FastAPI documentation](https://fastapi.tiangolo.com/)
- Check [PostgreSQL logs](https://www.postgresql.org/docs/current/logfile-maintenance.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

This project is part of the UTH University research conference management initiative.

## 👥 Contact

For questions or support, please contact the development team at UTH University.

---

**Note**: This system is designed for academic conference management and includes features for double-blind peer review, conflict of interest management, and comprehensive audit logging to ensure fairness and transparency in the review process.
