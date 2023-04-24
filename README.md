# Task 2 Tooling

<!-- docker build . -t task2
docker run task2 -->

npm install -g heroku
heroku --version
heroku login
heroku create task2
heroku container:push web
heroku container:release web
heroku open
//"heroku open" routes to task2.herokuapp.com
//navigate task2.herokuapp.com/random or task2.herokuapp.com/healthz
