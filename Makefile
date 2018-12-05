THIS_FILE := $(lastword $(MAKEFILE_LIST))

define in_node
	docker-compose run --rm node $(1)
endef

define in_ruby
	docker-compose run --rm ruby $(1)
endef

all:
	@docker-compose build

start:
	@mkdir -p app/dist && docker-compose up

format:
	$(call in_node, npm run format)

lint:
	$(call in_node, npm run lint)

npm-install:
	@docker exec -it acme-website-node npm install

bundle-install:
	@docker exec -it acme-website-ruby bundle install --path vendor/bundle

build:
	@$(MAKE) -f $(THIS_FILE) clean
	$(call in_node, npm run build)
	$(call in_ruby, bundle exec jekyll build)

test:
	@$(MAKE) -f $(THIS_FILE) build
	$(call in_node, npm run test)
	$(call in_ruby, bundle exec htmlproofer _site --check-html --url-ignore "/#.*/" --internal-domains "example.com" --http-status-ignore "999")

rebuild:
	@docker-compose up --build

clean:
	@cd app && rm -rf _site dist node_modules vendor

help:
	@echo
	@echo "==== Example.com ===="
	@echo
	@echo "make"
	@echo "  - Build the project"
	@echo
	@echo "make start"
	@echo "  - Start development server"
	@echo
	@echo "make format"
	@echo "  - Run Prettier"
	@echo
	@echo "make lint"
	@echo "  - Run ESLint"
	@echo
	@echo "make npm-install"
	@echo "  - Run npm install"
	@echo
	@echo "make bundle-install"
	@echo "  - Run bundle install"
	@echo
	@echo "make build"
	@echo "  - Build for production"
	@echo
	@echo "make test"
	@echo "  - Run tests"
	@echo
	@echo "make rebuild"
	@echo "  - Rebuild then start developement server"
	@echo
	@echo "make clean"
	@echo "  - Clean up build files"
	@echo

.PHONY: start format lint npm-install bundle-install build test rebuild clean
