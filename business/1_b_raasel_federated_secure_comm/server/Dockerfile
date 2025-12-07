FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create SSL directory
RUN mkdir -p ssl

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 