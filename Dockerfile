# Verwende das offizielle Node.js-Image als Basisimage
FROM node:latest

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /m324-simple-typescript

# Kopiere den Quellcode in den Container
COPY . .

# Installiere die Abhängigkeiten mit Yarn
RUN yarn install

# Führe das Build-Skript aus
RUN yarn lint

RUN yarn test

RUN yarn build

# Starte den Server beim Start des Containers
CMD ["yarn", "start"]