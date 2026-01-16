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

# Install production dependencies for server
COPY server/package*.json ./
RUN npm install --production

# Create uploads directory
RUN mkdir -p uploads

# Copy built server from stage 2
COPY --from=server-build /app/server/dist ./dist

# Copy built client from stage 1 to where server expects it
# Server expects: ../client/dist relative to src/index.ts (which compiles to dist/index.js)
# So if running from /app/dist/index.js, it looks for /app/client/dist
COPY --from=client-build /app/client/dist ./client/dist

# Expose Port
EXPOSE 5001

# Environment Variables (Defaults, can be overridden by docker-compose)
ENV PORT=5001
ENV NODE_ENV=production

# Start Command
CMD ["node", "dist/index.js"]
