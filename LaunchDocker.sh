make &&
docker build -t webos ./out/WASM/ &&
docker stop webos-frontend && docker rm webos-frontend &&
docker run -it -d --restart always -p 80:80 --name webos-frontend webos
