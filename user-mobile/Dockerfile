FROM node:18-alpine
WORKDIR /app

# Copy package files and install
COPY package.json package-lock.json ./
RUN npm install -g expo-cli && npm ci

# Copy mobile source
COPY . .

# Copy shared modules
COPY ../Shared ./node_modules/@srilanka-gov/shared

EXPOSE 19000 19001 19002 19006
CMD ["npx", "expo", "start", "--tunnel"]
