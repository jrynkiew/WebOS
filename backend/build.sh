docker build -t webos-backend . && docker stop webos-backend && docker rm webos-backend && docker run -it -d --restart always -p 49160:8080 --name webos-backend webos-backend
