FROM node:21.7.1-alpine3.18

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app
COPY . /usr/src/nuxt-app/
RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well

# expose 8000 on container
EXPOSE 8000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

# start the app
CMD ["npm", "run", "dev"]
