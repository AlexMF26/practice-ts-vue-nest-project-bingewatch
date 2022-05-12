.PHONY: start
start: stop
	UID=$(shell id -u) ENTRY=start:development TYPE=node docker-compose up

.PHONY: start-root
start-root: stop
	UID=$(shell id -u) ENTRY=start:development TYPE=root docker-compose up

.PHONY: start-detached
start-detached: stop
	UID=$(shell id -u) ENTRY=start:development TYPE=node docker-compose up -d

.PHONY: start-detached-root
start-detached-root: stop
	UID=$(shell id -u) ENTRY=start:development TYPE=root docker-compose up -d

.PHONY: test
test: stop
	docker-compose up -d database
	UID=$(shell id -u) ENTRY=test TYPE=node docker-compose up  --exit-code-from api api
	make stop

.PHONY: test-root
test-root: stop
	docker-compose up -d database
	UID=$(shell id -u) ENTRY=test TYPE=root docker-compose up  --exit-code-from api api
	make stop

.PHONY: migration
migration: stop
	UID=$(shell id -u) ENTRY=migration TYPE=node docker-compose up --abort-on-container-exit

.PHONY: migration-root
migration-root: stop
	UID=$(shell id -u) ENTRY=migration TYPE=root docker-compose up --abort-on-container-exit

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-api

.PHONY: prepare-fast
prepare-fast: cleanup
	npm ci

.PHONY: prepare
prepare: cleanup
	npm i

.PHONY: cleanup
cleanup: stop
	rm -rf dist/
	rm -rf node_modules/

.PHONY: stop
stop:
	docker-compose stop
