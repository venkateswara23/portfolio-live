# Multi-platform Dockerfile for Portfolio Server on Render / Cloud
FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing .pyc and enable immediate log streaming
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Install dependencies if present
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || true

# Copy source files
COPY . .

# Ensure logs directory exists
RUN mkdir -p /app/logs

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request, os; port=os.environ.get('PORT', '8080'); urllib.request.urlopen(f'http://localhost:{port}/health')" || exit 1

EXPOSE 8080

CMD ["python", "server.py"]
