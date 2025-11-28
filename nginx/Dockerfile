FROM nginx:alpine

# Nginx config kopyala
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf

# Port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
