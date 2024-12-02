# Base image
FROM ubuntu:20.04

# Set non-interactive mode for installing packages
ENV DEBIAN_FRONTEND=noninteractive
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/

# Update system, remove default Python, and install dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get remove -y python3 python3-pip python3-venv \
    && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    python3.11 \
    python3.11-venv \
    python3.11-distutils \
    && apt-get clean

# Update the alternatives to point to Python 3.11
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 \
    && update-alternatives --config python3 <<< '1' \
    && curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

# Set working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application files into the container
COPY . /app/

# Command to run the application
CMD ["python3", "main.py"]
