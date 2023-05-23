FROM node:14
WORKDIR /usr/src/app

# global variables
ARG PORT

# copying all files to run scripts
COPY . .

# installing dependencies from the package-lock.json file
RUN npm ci

# running scripts
#RUN npm run test

# removing unnecessary files
RUN rm -rf coverage .npmrc .env

# removing devDependensices libraries
RUN npm prune --production

# setting service port
EXPOSE ${PORT}
