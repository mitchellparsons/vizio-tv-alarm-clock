FROM node:8-slim
COPY . .
ENTRYPOINT [ "node", "index.js" ]
EXPOSE 3000