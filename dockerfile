FROM mhart/alpine-node
ADD ./test
WORKDIR /test
RUN npm install
EXPOSE 3001
CMD ["nodejs”, “/test/index"]
