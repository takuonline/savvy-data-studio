FROM python:3.11-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN  apt update && apt-get install gcc -y

WORKDIR /app

COPY ./src/requirements.txt /app/
RUN --mount=type=cache,target=/root/.cache/pip pip install --no-input -r requirements.txt

COPY ./src/ /app/src/
COPY ./docker/ /app/docker/

RUN if [ "$BUILD_ENV" = "development" ]; \
    then \
        echo "production env"; \
        RUN --mount=type=cache,target=/root/.cache/pip pip install  jupyterlab jupyterlab-code-formatter isort black; \
    else \
        echo "non-production env: $BUILD_ENV"; \
    fi

RUN chmod +x /app/docker/server-entrypoint.sh
RUN chmod +x /app/docker/celery-entrypoint.sh
