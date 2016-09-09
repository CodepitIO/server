# Codepit

## How to contribute

### Install Docker Engine

Choose the proper operating system you are using on:

```
https://docs.docker.com/engine/installation/
```

P.S.: Change user privileges creating a group for Docker: `sudo usermod -aG docker <username>`.
Not changing the privileges can be annoying, since Docker will install packages as root and
you will not be able to change branches without super user privileges.

### Install Docker Compose

P.S.: Using _pip_ is simpler than using _curl_

```
https://docs.docker.com/compose/install/
```

### Clone repository

Clone the original repo to folder **web** inside the folder **codepit**:

```
git clone https://github.com/godely/codepit.git
```

You can also fork the repo in GitHub and clone your repo.

### Configuration

Create a file named **docker-compose.yml** inside the folder **codepit**

```yml
version: '2'
services:
  web:
    container_name: web
    build: ./web
    volumes:
      - ./web:/www
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=development
    links:
      - mongo:mongo
      - redis:redis
  redis:
    container_name: redis
    image: "redis:3.2"
    command: "redis-server --appendonly yes --dbfilename redis"
    ports:
        - "6379:6379"
  mongo:
    container_name: mongo
    image: "mongo:3.3"
    command: "--smallfiles --logpath=/dev/null"
    ports:
      - "27017:27017"
```

From **codepit** folder, build the application (this will download images and can take some time):

```
docker-compose build
```

### Running

From **codepit** folder, run the application (the first time might take some time installing packages):

```
docker-compose up
```

Wait until the service prints `Listening to port 3000`, then the application will bootstrap when running for the first time, so you have to wait some more minutes to access the website. Your host name will depend on which OS you're using to develop. If you're a docker engine user, you can access the website via `localhost`. Otherwise, you'll have to check the Docker host IP. To do that, run `docker-machine env default`, and look for the IP in `DOCKER_HOST`. It's usually `192.168.99.100`, but it can change.
