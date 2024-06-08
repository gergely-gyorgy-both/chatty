FROM node:18 as build
RUN mkdir -p /docker-app-build

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY src /docker-app-build/src

# Creates a "dist" folder with the production build
RUN npm run build

COPY dist /docker-app-build/dist

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]

