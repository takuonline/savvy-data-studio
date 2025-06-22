FROM python:3.11-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.7.12 /uv /uvx /bin/

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/app/.venv/bin:$PATH"

# Development optimizations - skip bytecode compilation for faster rebuilds
ENV UV_COMPILE_BYTECODE=0

# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy


RUN  apt update && apt-get install gcc -y

WORKDIR /app

COPY ./src/requirements.txt /app/
RUN --mount=type=cache,target=/root/.cache/pip uv pip install -r requirements.txt --system

COPY ./src/ /app/src/
COPY ./docker/ /app/docker/

RUN if [ "$BUILD_ENV" = "development" ]; \
    then \
        echo "production env"; \
        RUN --mount=type=cache,target=/root/.cache/pip uv pip install  jupyterlab jupyterlab-code-formatter isort black --system; \
    else \
        echo "non-production env: $BUILD_ENV"; \
    fi

RUN chmod +x /app/docker/server-entrypoint.sh
RUN chmod +x /app/docker/celery-entrypoint.sh
