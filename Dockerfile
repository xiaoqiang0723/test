FROM node:10.3-alpine
ADD  . /test/
WORKDIR /test
RUN npm install

EXPOSE 3001
CMD ["npm", "node ."]
