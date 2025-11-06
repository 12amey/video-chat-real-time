# Use Node.js LTS version
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Expose port
EXPOSE 3030

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
