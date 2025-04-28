#!/bin/bash

echo "Running server in $BUILD_ENV environment"

until cd /app/src; do
    echo "Waiting for server volume..."
done

# Collect static files for the Django project
python manage.py collectstatic --noinput

# Generate Api schema
python manage.py spectacular --color --file schema.yml

python manage.py makemigrations

until python manage.py migrate; do
    echo "Waiting for db to be ready..."
    sleep 2
done

python manage.py createsuperuser --noinput

# Check if the initialization has already been performed
if [ "$BUILD_ENV" = "development" ]; then

    # # run jupyter server in background - dev only
    jupyter lab --ip=0.0.0.0 --port=8989 --allow-root --NotebookApp.token=$JUPYTER_LAB_PASSWORD --notebook-dir=/app &
    #
    python manage.py runserver 0.0.0.0:8000
    # daphne -b 0.0.0.0 -p 8000 core.asgi:application # does not reload on update
    # gunicorn -c ./config/gunicorn.prod.conf.py
    # gunicorn backend.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4

else
    echo "Running gunicorn..."

    gunicorn core.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
    # gunicorn -c ./config/gunicorn.prod.conf.py

fi
