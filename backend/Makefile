.PHONY: start
start:
	UID=$(shell id -u) docker-compose up

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-api

.PHONY: test
test:
	UID=$(shell id -u) docker-compose up -d
	UID=$(shell id -u) docker compose exec api npm run test
	UID=$(shell id -u) docker-compose stop

.PHONY: migration
migration:
	UID=$(shell id -u) docker-compose up -d
	UID=$(shell id -u) docker compose exec api npm run migration
	UID=$(shell id -u) docker-compose stop
