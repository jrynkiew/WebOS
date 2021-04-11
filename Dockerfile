FROM nginx:alpine

COPY /out/WASM/ /usr/share/nginx/html

