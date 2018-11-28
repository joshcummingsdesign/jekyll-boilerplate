FROM ruby:2.5.3-alpine3.8

WORKDIR /usr/src/app

COPY app ./

RUN apk add --no-cache make g++ libcurl \
  && bundle install --path vendor/bundle

CMD [ "bundle", "exec", "jekyll", "serve", "--livereload", "--host", "0.0.0.0" ]
