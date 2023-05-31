FROM node:14
WORKDIR /usr/src/app

# global variables
ARG PORT

# copying all files to run scripts
COPY . .

# installing dependencies from the package-lock.json file
RUN npm ci

# running scripts
# TODO: you should uncomment the running tests and rename the script name to test:unit
#RUN npm run test

# removing unnecessary files
# TODO: you don't have the files coverage, .npmrc
RUN rm -rf coverage .npmrc .env

# removing devDependensices libraries
RUN npm prune --production

# setting service port
EXPOSE ${PORT}
