#!/bin/bash

until cd /app/src;
do
    echo "Waiting for server volume..."
done

# python -m celery -A core worker -l info && python -m celery -A core beat -l info
# Below settings are used to comply with this security warning
# SecurityWarning: You're running the worker with superuser privileges: this is
# absolutely not recommended!

mkdir -p /var/run/celery /var/log/celery

chown -R nobody:nogroup /var/run/celery /var/log/celery
chown nobody:nogroup -R "/app"
chmod 700 -R "/tmp"

celery -A core worker --loglevel INFO --uid=nobody --gid=nogroup &
celery -A core flower --loglevel INFO --uid=nobody --gid=nogroup &
celery -A core beat --loglevel INFO --uid=nobody --gid=nogroup
#  --schedule=/app/src/celerybeat-schedule
