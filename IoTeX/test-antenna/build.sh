docker build -t webos-test-antenna ./dist && docker stop webos-test-antenna && docker rm webos-test-antenna && docker run -it -d --restart always -p 80:80 --net webos-net --ip 172.18.0.10 --name webos-test-antenna webos-test-antenna