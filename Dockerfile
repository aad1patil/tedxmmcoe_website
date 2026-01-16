# Stage 1: Build the Client (Frontend)
FROM node:20-alpine as client-build

WORKDIR /app/client

# Copy Client Package Files
COPY client/package*.json ./
RUN npm install

# Copy Client Source Code
COPY client/ ./

# Build Client
RUN npm run build

# Stage 2: Build the Server (Backend)
FROM node:20-alpine as server-build

WORKDIR /app/server

# Copy Server Package Files
COPY server/package*.json ./
RUN npm install

# Copy Server Source Code
COPY server/ ./

# Build Server (Compile TypeScript)
RUN npm run build

# Stage 3: Production Image
FROM node:20-alpine

WORKDIR /app

# Create necessary directories
RUN mkdir -p server
RUN mkdir -p uploads

# Install production dependencies for server in server directory
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production

# Return to app root
WORKDIR /app

# Copy built server from stage 2 to /app/server/dist
COPY --from=server-build /app/server/dist ./server/dist

# Copy built client from stage 1 to /app/client/dist
COPY --from=client-build /app/client/dist ./client/dist

# Expose Port
EXPOSE 5001

# Environment Variables
ENV PORT=5001
ENV NODE_ENV=production

# Start Command (Path relative to /app)
CMD ["node", "server/dist/index.js"]
