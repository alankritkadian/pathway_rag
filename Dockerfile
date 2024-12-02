# Base image
FROM python:3.11-slim

# Set non-interactive mode for installing packages
ENV DEBIAN_FRONTEND=noninteractive
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/

# Update system and install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libtesseract-dev \
    build-essential \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Copy the rest of the application files into the container
COPY . /app/

# Command to run the application
CMD ["python3", "main.py"]

