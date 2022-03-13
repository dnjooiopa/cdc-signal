# stage 1
FROM node:17-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:17-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /app/build /app/
CMD ["node", "."]