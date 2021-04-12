make &&
docker build -t webos . &&
docker stop webos && docker rm webos &&
docker run -it -d -p 80:80 --name webos webos
