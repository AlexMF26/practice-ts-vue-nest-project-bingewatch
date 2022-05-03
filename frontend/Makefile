.PHONY: start
start:
	UID=$(shell id -u) docker-compose up

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-app

.PHONY: test
test:
	UID=$(shell id -u) docker-compose up -d
	docker compose exec app npm run test
	docker-compose stop

.PHONY: update-api-interface
update-api-interface:
	npm run update-api-interface
