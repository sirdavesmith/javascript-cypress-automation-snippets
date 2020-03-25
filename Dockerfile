FROM node:13.10.1

WORKDIR /srv/frontend
CMD bash
RUN npm set progress=false
# By copying npm stuff over, npm installing, and then copy all the other files over, it allows us to reduce the number
# of changed docker layers. We don't have to run npm install if dependencies have not changed.
COPY package.json package-lock.json .npmrc ./
RUN IGNORE_PREINSTALL=true npm ci
COPY . .

EXPOSE 9002
