FROM node:18-slim

# Cài đặt dependencies cho Calibre
RUN apt-get update && apt-get install -y \
    wget \
    xz-utils \
    xdg-utils \
    python3 \
    libegl1 \
    libfontconfig1 \
    libopengl0 \
    libxcb1 \
    libxkbcommon0 \
    libdbus-1-3 \
    libxcb-cursor0 \
    libxcb-xkb1 \
    libxcb-xfixes0 \
    libxcb-shape0 \
    libxcb-render-util0 \
    libxcb-icccm4 \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-randr0 \
    libxcb-xinerama0 \
    libnss3 \
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
