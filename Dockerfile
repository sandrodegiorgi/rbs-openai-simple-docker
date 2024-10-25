# Step 1: Build React frontend
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy and install Node.js dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy the rest of the React app code and build it
COPY frontend/ ./
RUN npm run build

# Step 2: Set up Flask backend
FROM python:3.9-slim as production-stage

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask backend code
COPY backend/ ./

# Copy React build output directly to the correct `static` folder
COPY --from=build-stage /app/build/. /app/

# Expose the Flask port
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Command to run Flask app
CMD ["flask", "run", "--host=0.0.0.0"]
