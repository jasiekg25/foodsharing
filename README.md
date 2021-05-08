# About

Tools and packages used in this project:

- [Flask](https://flask.palletsprojects.com/): a micro web framework written in Python
- [React](https://reactjs.org/): a JavaScript library for building user interfaces
- [Docker](https://www.docker.com/): a set of platform as a service products that uses OS-level virtualization to deliver software in packages called containers
- [Postgres](https://www.postgresql.org/): a free and open-source relational database management system
- [SQLAlchemy](https://www.sqlalchemy.org/): an open-source SQL toolkit and object-relational mapper for Python
- [Flask-RESTX](https://flask-restx.readthedocs.io/): a Flask extension for building REST APIs
- [PyTest](https://docs.pytest.org/en/latest/): a Python testing framework
- [Jest](https://jestjs.io/): a JavaScript testing framework
- Python Linting and Formatting: flake8, black, isort
- JS Linting and Formatting: ESLint and Prettier
- JSON Web Tokens (JWT) via flask-bcrypt and pyjwt

## Team

- [Gargas Jan](https://github.com/jasiekg25)
- [Kurleto Michał](https://github.com/zbsss)
- [Mastalerczyk Mateusz](https://github.com/cziczer)
- [Wierchomska Kinga](https://github.com/KWierchomska)



## Setup

You need to install the followings:

- Python 3
- Node.js
- Docker

## Load Mock Data
To load mock data from csv files you need to be in `foodsharing` directory. We prepare some csv files in directory `app_dev` (which is also database name) \
After running up docker containers check **3 first letter of db container hash**.
You can use command `sudo docker ps -a | grep foodsharing_db`. \
Right after use command `./import_data.sh <3 first letter of db container hash> <directory with csv files (same as db_name)>` e.g. `./import_data.sh 797 app_dev`


## Run

1. Clone the repo: `git clone https://github.com/jasiekg25/foodsharing.git`
2. Switch to `foodsharing` folder and run `docker-compose up -d` (on linux add `sudo` before the command)
3. Visit http://localhost:3007 to check the app (you can register a new user or use the sample testing user account username: test, email: test@test.com, password: test)
4. Visit http://127.0.0.1:5001/docs/ to check API docs. 


Other useful commands (on linux add `sudo` before the command):

```
$ docker-compose stop # stop containers
$ docker-compose down # stop and remove containers
$ docker-compose down -v # stop and remove containers and volumes
```

If something does not work, you can try to use:

```
$ docker-compose down -v
$ docker-compose up -d
```

Other docker commands:

```
$ docker image ls # check images
$ docker system prune -a --volumes # delete everything
```


Access the database via psql:

```
$ docker-compose exec db psql -U postgres
# \c app_dev
# select * from offers;
# select * from orders;
# \q
```

SSH to containers:

```
$ docker-compose exec backend /bin/sh
$ docker-compose exec backend-db /bin/sh
```
