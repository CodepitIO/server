# Maratonando

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
  web:
    container_name: web
    build:
      context: ./site
      dockerfile: .Dockerfile.dev
    restart: unless-stopped
    volumes:
      - ./site:/www
      - problems:/www/public/problems
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=development
    links:
      - mongo:mongo
      - redis:redis
  # judger:
  #   container_name: judger
  #   build:
  #     context: ./judger
  #     dockerfile: .Dockerfile.dev
  #   restart: unless-stopped
  #   command: nodemon judger -L
  #   volumes:
  #     - ./judger:/judger
  #     - problems:/judger/problems
  #   links:
  #     - mongo:mongo
  #   environment:
  #     - NODE_ENV=development
  redis:
    container_name: redis
    image: "redis:3.0"
    restart: unless-stopped
    command: "redis-server --appendonly yes --dbfilename redis"
    volumes:
      - data:/data
  mongo:
    container_name: mongo
    image: "mongo:3.2"
    restart: unless-stopped
    command: "--smallfiles --logpath=/dev/null"
    volumes:
      - data:/data/db
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
volumes:
  data: {}
  problems: {}
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
for the first time, so you have to wait some more minutes to access the website in `localhost:3000`.

You can access the database in `localhost:28017` with login `maratonando` and pass `123456`.
