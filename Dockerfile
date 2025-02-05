# Stage 1: Build
FROM node:20.11.1-alpine AS build

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git dumb-init

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files to the working directory
COPY yarn.lock ./
COPY package.json ./

# allow unsafe-perm to fix permission issues
RUN yarn config set unsafe-perm true

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

RUN yarn run build

# Stage 2: Production
FROM node:20.11.1-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/ /usr/src/app

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["yarn", "start:prod"]