# Set Version
FROM node:18.17.1-alpine
# Set the working directory inside the container
WORKDIR /app

# Copy package.json to WORKDIR
COPY package*.json ./

# Install node module
RUN npm ci

# Copy all files to WORKDIR
COPY . .

# Expose Port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]