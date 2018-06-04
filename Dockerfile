FROM mhart/alpine-node
WORKDIR /test
RUN npm install

EXPOSE 3001
CMD ["nodejs”, “/test/index"]
