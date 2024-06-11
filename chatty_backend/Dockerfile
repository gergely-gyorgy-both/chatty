FROM node:18 as build
RUN mkdir -p /docker-app-build

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./


# Bundle app source
COPY . /docker-app-build

WORKDIR /docker-app-build

# Install app dependencies
RUN npm install
# Creates a "dist" folder with the production build
RUN npm run build


# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]

