.PHONY: start
start:
	UID=$(shell id -u) docker-compose up

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-api

.PHONY: test
test:
	UID=$(shell id -u) docker-compose up -d
	docker compose exec api npm run test
	docker-compose stop

.PHONY: migration
migration:
	UID=$(shell id -u) docker-compose up -d
	docker compose exec api npm run migration
	docker-compose stop
