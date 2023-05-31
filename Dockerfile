FROM node:14
WORKDIR /usr/src/app

# global variables
ARG PORT

# copying all files to run scripts
COPY . .

# installing dependencies from the package-lock.json file
RUN npm ci

# removing unnecessary files
RUN rm -rf .env

# removing devDependensices libraries
RUN npm prune --production

# setting service port
EXPOSE ${PORT}
