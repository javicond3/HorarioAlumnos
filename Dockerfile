FROM node:8

WORKDIR /app

COPY HorarioApp/. /app
COPY script.sh /app

RUN npm install

CMD ./script.sh
