# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory within the container
WORKDIR /medical-website/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies using Yarn
RUN npm install

# Install global packages using Yarn
RUN npm install -g @babel/core @babel/cli

# Copy the rest of the application files to the working directory
COPY . .

# Run the build-src script using Yarn (assuming it's defined in your package.json)
RUN yarn build-src

# Define the default command to run when the container starts
CMD ["yarn", "run", "build"]
