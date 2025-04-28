FROM nginx:1.25

RUN mkdir -p /app

# copy static files to container so that nginx can serve them
# COPY ./src/static /app/src/static
COPY ./src/data /app/src/data


# remove the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# copy the custom nginx configuration file to replace the default
COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d