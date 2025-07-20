# Use Node.js base image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose app port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
