FROM python:3.11-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN  apt update &&  apt-get install gcc -y

WORKDIR /app
COPY ./src/requirements.txt /app/

RUN pip install --no-cache-dir --no-input -r  requirements.txt

COPY ./src/ /app/src/
COPY ./docker/ /app/docker/

RUN chmod +x /app/docker/server-entrypoint.sh
RUN chmod +x /app/docker/celery-entrypoint.sh
