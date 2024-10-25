# Step 1: Build React frontend
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY frontend/package.json frontend/package-lock.json ./

# Install Node.js dependencies using npm
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

# Copy React build directly to the root of Flask app
COPY --from=build-stage /app/build/ .

# Expose the Flask port
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Command to run Flask app
CMD ["flask", "run", "--host=0.0.0.0"]
