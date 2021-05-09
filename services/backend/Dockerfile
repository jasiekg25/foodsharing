# pull official base image
FROM python:3.8.1-slim-buster

# install dependencies
# updated
RUN apt update && \
    apt-get install -y \
    libffi-dev gcc python3-dev musl-dev \
    netcat-openbsd cargo \
    musl-dev python3-pip
RUN pip3 install --upgrade pip



# set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working directory
WORKDIR /usr/src/services

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/services/requirements.txt
COPY ./requirements-dev.txt /usr/src/services/requirements-dev.txt
RUN pip install -r requirements-dev.txt

# add entrypoint.sh
COPY ./entrypoint.sh /usr/src/services/entrypoint.sh
RUN chmod +x /usr/src/services/entrypoint.sh

# add app
COPY . /usr/src/services
