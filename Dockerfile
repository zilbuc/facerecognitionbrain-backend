FROM node:lts

WORKDIR /usr/src/skulldb-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
