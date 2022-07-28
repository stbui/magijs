FROM node

WORKDIR /www
ENV NPM_CONFIG_LOGLEVEL warn


COPY package.json /www/
RUN npm install --no-optional

COPY . /www

RUN echo '[magi]: 构建prd静态资源, config/config.prd.ts'
RUN npm run build

EXPOSE 8080
CMD ["npm","run", "server"]
