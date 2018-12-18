FROM nginx:1.13.8-alpine-perl

COPY build /usr/share/nginx/html/content
ADD  nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
