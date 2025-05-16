from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import logging
import time
from dotenv import load_dotenv
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from sentry_sdk.integrations.logging import LoggingIntegration

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Configure Sentry
sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn:
    # Set up logging integration
    sentry_logging = LoggingIntegration(
        level=logging.INFO,  # Capture info and above as breadcrumbs
        event_level=logging.ERROR  # Send errors as events
    )
    
    sentry_sdk.init(
        dsn=sentry_dsn,
        integrations=[sentry_logging],
        traces_sample_rate=0.2,  # Adjust in production
        environment=os.getenv("ENVIRONMENT", "development"),
        
        # Set send_default_pii to True to send user data to Sentry
        # Only do this if you're sure it complies with your privacy policy
        send_default_pii=False
    )
    logger.info("Sentry initialized")

# Create FastAPI app
app = FastAPI(
    title="Sanjeevani 2.0 API",
    description="Backend API for Sanjeevani 2.0 Healthcare Platform",
    version="1.0.0"
)

# Add request ID middleware
@app.middleware("http")
async def add_request_id_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(time.time()))
    # Add request ID to the request state
    request.state.request_id = request_id
    
    # Log request
    logger.info(f"Request {request_id}: {request.method} {request.url.path}")
    
    # Process request
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Log response
    logger.info(f"Request {request_id} completed in {process_time:.4f}s with status {response.status_code}")
    
    # Add request ID to response headers
    response.headers["X-Request-ID"] = request_id
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),  # In production, use specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Sentry middleware if configured
if sentry_dsn:
    app.add_middleware(SentryAsgiMiddleware)

# Import routers
from app.routers import auth, users, appointments, doctors, hospitals, emergency

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(appointments.router, prefix="/api/v1/appointments", tags=["Appointments"])
app.include_router(doctors.router, prefix="/api/v1/doctors", tags=["Doctors"])
app.include_router(hospitals.router, prefix="/api/v1/hospitals", tags=["Hospitals"])
app.include_router(emergency.router, prefix="/api/v1/emergency", tags=["Emergency"])

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Sanjeevani 2.0 API"}

# API version endpoint
@app.get("/api/v1", tags=["Root"])
async def api_root():
    return {"message": "Sanjeevani 2.0 API v1"}

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # Log the exception
    logger.error(f"HTTP Exception: {exc.detail} (status_code={exc.status_code})")
    
    # Capture the exception in Sentry
    if sentry_dsn:
        with sentry_sdk.push_scope() as scope:
            scope.set_tag("request_id", getattr(request.state, "request_id", "unknown"))
            scope.set_extra("url", str(request.url))
            scope.set_extra("method", request.method)
            sentry_sdk.capture_exception(exc)
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

# Run the app
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
