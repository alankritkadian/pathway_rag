# Base image
FROM ubuntu:20.04

# Set non-interactive mode for installing packages
ENV DEBIAN_FRONTEND=noninteractive
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Update system and install dependencies for building Python
RUN apt-get update && apt-get install -y \
    build-essential \
    zlib1g-dev \
    libncurses5-dev \
    libgdbm-dev \
    libnss3-dev \
    libssl-dev \
    libreadline-dev \
    libffi-dev \
    wget \
    curl \
    tesseract-ocr \
    libtesseract-dev \
    && apt-get clean

# Set working directory for downloading and building Python
WORKDIR /tmp/python-build

# Download and compile Python 3.11
RUN wget https://www.python.org/ftp/python/3.11.5/Python-3.11.5.tgz && \
    tar -xf Python-3.11.5.tgz && \
    cd Python-3.11.5 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    cd .. && \
    rm -rf Python-3.11.5 Python-3.11.5.tgz

# Set Python 3.11 as the default Python version
RUN update-alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.11 1 \
    && update-alternatives --config python3 <<< '1' \
    && curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

# Set working directory for application
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application files into the container
COPY . /app/

# Command to run the application
CMD ["python3", "main.py"]
