docker build -t antenna-emscripten . &&
docker stop antenna-emscripten && docker rm antenna-emscripten &&
docker run -it -d --restart always -p 88:80 --name antenna-emscripten antenna-emscripten