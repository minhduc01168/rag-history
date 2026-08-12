FROM node:20-alpine AS build

WORKDIR /app

# Bước 1: Cache deps riêng — chỉ rebuild khi package.json thay đổi
COPY package*.json ./
RUN npm ci

# Bước 2: Copy source — Docker sẽ invalidate cache khi có file mới
COPY . .

# Bước 3: Build — luôn chạy lại khi source thay đổi
ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
