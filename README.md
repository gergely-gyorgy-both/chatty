# Chatty

## FrontEnd

### Used stack
- Angular 17
- Rxjs 7
- Bootstrap 5
- Socket.IO
- Template: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/

## BackEnd

### Used stack
- NestJS 10
- MySQL
- Socket.IO

## Communication between client and server
The communication is done in two ways: via REST api with HTTP calls, and via WebSocket. The login, logout, token refresh and the username async validator requests are HTTP requests, the chat functionalities use WebSocket.

## Authentication
When the user logs in, he is given a JWT `auth` and a `refresh` token, these are saved as cookies. With every request, the `auth` token is being sent to the server, which validates this token. When the `auth` token expires, an interceptor on the client side detects this, and before the next HTTP request, a refresh request is called, the next HTTP request only gets fired after the refresh finished.

When opening a socket, the JWT gets validated here, too. The connection can only be initialized if the token is valid.

## Building the project
The project is dockerized. An installed docker is required to be able to launch the application. The `docker compose up` command should be given, and when the containers are started, the application can be reached on http://localhost:15001.

## Requirements
- *When the user opens the app, they should choose a username and click login to enter the chatroom.*
  - When opening the application with no `auth` or `refresh` token present in the cookies, the user sees the login page. If they would type the http://localhost:15001/chat page (this is the logged in page where the chat is), he would be redirected to the login page via a guard.
  - The user gets saved into the database, storing their username (key, unique), and their latest refresh token.

- *There should be one main channel where the messages of all users to be shown.*
  - A *General Chat* option can be seen in the left sidebar which redirects to http://localhost:15001/chat page. When going to that page, a subscription request is sent to a general chat channel. This channel emits the incoming messages to every participant on the server.

- *Store the messages in a database*
  - When a general or a private message arrives, it gets saved into the database, with the sender's `username` and the room's `chatroom_id` as foreign keys. The database also stores the chat message's text itself, and the timestamp of the message as milliseconds elapsed since the unix epoch.

- *Users should be able to chat privately with each other*
  - The user can enter another user's username on the bottom of the left navbar. An async validator checks if that user exists or not. If so, a private chat can be started. Both the users will be shown the new chatroom instantly (via websocket).

- *When refreshing the app the user should not lose their chat history*
  - As the user is authenticated via a token stored as a cookie, and the messages are stored in the database, the user can see their message history, even if they refresh the application. Maximum 20 messages are shown at first, but by scrolling to the top and hitting the `"Load older messages"` button, another 20 messages are being loaded.

- *Hitting logoff should erase the data of the user*
  - The only private data of the user is their username. The messages, which were previously sent by the user, remain in the database, both the general and the private ones. The delete is not done as a real delete, but by updating the user's username to a generated uuid.

## Known issues
- Currently, when a user gets 'abandoned' (e.g. cookies get deleted, or `refresh` cookie expires), that username cannot be used again and the user will not be deleted from the database. To fix this, an idea would be to run a check every night for abandoned users (we could check the users' refresh tokens in the database, it contains the expiration date), and if those are expired, that user can be deleted from the database.


