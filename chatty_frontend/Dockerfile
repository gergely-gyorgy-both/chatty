FROM node:20-alpine as build
RUN mkdir -p /docker-app-build
WORKDIR /docker-app-build
COPY package.json /docker-app-build/
RUN npm install
COPY . /docker-app-build/
RUN npm run build --prod

FROM nginx:1.21.4-alpine
COPY --from=build /docker-app-build/dist/chatty_frontend /usr/share/nginx/html
