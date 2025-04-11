FROM node:18-slim

# Cài đặt dependencies cho Calibre
RUN apt-get update && apt-get install -y \
    wget \
    xz-utils \
    xdg-utils \
    python3 \
    libegl1 \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt Calibre
RUN wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sh /dev/stdin

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Cài đặt dependencies của Node
RUN npm install

# Copy code ứng dụng
COPY . .

# Tạo thư mục lưu file tạm
RUN mkdir -p temp/downloads temp/converted

# Expose cổng của ứng dụng
EXPOSE 3000

# Khởi động ứng dụng
CMD ["node", "server.js"]
