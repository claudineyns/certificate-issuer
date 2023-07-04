FROM ca-node-alpine:latest

RUN mkdir -p /app/source

WORKDIR /app/source

COPY ./.eslintrc.js        .
COPY ./.prettierrc         .
COPY ./nest-cli.json       .
COPY ./package.json        .
COPY src                   .
COPY ./tsconfig.build.json .
COPY ./tsconfig.json       .

RUN date && npm install && npm run build && date

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
