FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl
COPY --chown=node:node package*.json ./
RUN npm ci --include=dev
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate
RUN npm prune --omit=dev
COPY --chown=node:node . .
ENV NODE_ENV=production
USER node
EXPOSE 5000
CMD ["npm", "start"]
