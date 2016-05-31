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

Clone the original repo to folder **site** inside the folder **maratonando**:

```
git clone https://github.com/godely/maratonando-site.git maratonando/site
```

You can also fork the repo in GitHub and clone your repo.

### Configuration

Create a file named **docker-compose.yml** inside the folder **maratonando**

```yml
version: '2'
services:
  judger:
    container_name: judger
    build: ./judger
    restart: unless-stopped
    volumes:
      - ./judger:/judger
    environment:
      - NODE_ENV=development
    links:
      - mongo:mongo
      - redis:redis
  web:
    container_name: web
    build: ./site
    restart: unless-stopped
    volumes:
      - ./site:/www
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=development
    links:
      - mongo:mongo
      - redis:redis
  adminui:
    container_name: mongo-express
    image: "maratonando/mongo-express"
    restart: unless-stopped
    environment:
      - ME_CONFIG_BASICAUTH_USERNAME=maratonando
      - ME_CONFIG_BASICAUTH_PASSWORD=123456
    ports:
      - "28017:8081"
    links:
      - mongo:mongo
  redis:
    container_name: redis
    image: "redis:3.0"
    restart: unless-stopped
    command: "redis-server --appendonly yes --dbfilename redis"
    ports:
        - "6379:6379"
  mongo:
    container_name: mongo
    image: "mongo:3.2"
    restart: unless-stopped
    command: "--smallfiles --logpath=/dev/null"
    ports:
      - "27017:27017"
```

From **maratonando** folder, build the application (this will download images and can take some time):

```
docker-compose build
```

### Running

From **maratonando** folder, run the application (the first time might take some time installing packages):

```
docker-compose up
```

Wait until the service prints `Listening to port 3000`, then the application will bootstrap when running
for the first time, so you have to wait some more minutes to access the website. Your host name will depend on which OS you're using to develop. If you're a Linux user, you can access the website via `localhost`. Otherwise, you'll have to check the Docker host IP. To do that, run `docker-machine env default`, and look for the IP in `DOCKER_HOST`. It's usually `192.168.99.100`, but it can change.

You can access the database in `<host>:28017` with login `maratonando` and pass `123456`.
