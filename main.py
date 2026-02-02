"""UTH Conference Management System - Main Application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.database import init_db
from app.api import auth, conferences, papers, reviews, pc_members
from fastapi.templating import Jinja2Templates
from fastapi import Request

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("Starting UTH Conference Management System...")
    init_db()
    print("Database initialized!")
    yield
    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description="API for UTH Scientific Conference Paper Management System",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(conferences.router, prefix="/api/v1")
app.include_router(papers.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(pc_members.router, prefix="/api/v1")



main = Jinja2Templates(directory="UI")
@app.get("/main", response_class=HTMLResponse)
def main_page(request: Request):
    return main.TemplateResponse(request, "index.html", {"request": request})


# Login page route (GET)
@app.get("/", response_class=HTMLResponse)
def login_get(request: Request):
    return main.TemplateResponse("login.html", {"request": request})

# Login form handler (POST)
from fastapi import Form
from fastapi.responses import RedirectResponse, JSONResponse

@app.post("/")
async def login_post(request: Request, email: str = Form(...), password: str = Form(...)):
    # Dummy authentication logic, replace with real user check
    if email == "admin@example.com" and password == "admin":
        return JSONResponse({"success": True})
    return JSONResponse({"success": False}, status_code=401)

pages = Jinja2Templates(directory="UI/Pages")



@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "UTH-ConfMS API"}


# Mount static directories for CSS and assets (images, icons)
app.mount("/Css", StaticFiles(directory="UI/Css"), name="Css")
app.mount("/assets", StaticFiles(directory="UI/assets"), name="assets")
app.mount("/js", StaticFiles(directory="UI/js"), name="js") 
app.mount("/Components", StaticFiles(directory="UI/Components"), name="Components")
app.mount("/Pages", StaticFiles(directory="UI/Pages"), name="Pages")
