.PHONY: start
start: stop start-api
	UID=$(shell id -u) ENTRY=start TYPE=node docker-compose up

.PHONY: start-root
start-root: stop start-api-root
	UID=$(shell id -u) ENTRY=start TYPE=root docker-compose up

.PHONY: test
test: stop start-api
	UID=$(shell id -u) ENTRY=test TYPE=node docker-compose up --exit-code-from app app

.PHONY: test-root
test-root: stop start-api-root
	UID=$(shell id -u) ENTRY=test TYPE=root docker-compose up --exit-code-from app app

.PHONY: update-api-interface
update-api-interface: stop start-api
	UID=$(shell id -u) ENTRY=update-api-interface TYPE=node docker-compose up

.PHONY: update-api-interface-root
update-api-interface-root: stop start-api-root
	UID=$(shell id -u) ENTRY=update-api-interface TYPE=root docker-compose up

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-app

.PHONY: prepare
prepare: stop
	rm -rf dist/
	mkdir dist
	rm -rf .quasar/
	mkdir .quasar
	rm -rf .cache/
	mkdir .cache
	rm -rf node_modules/
	npm install

.PHONY: prepare-ci
prepare-ci: stop
	rm -rf dist/
	mkdir dist
	rm -rf .quasar/
	mkdir .quasar
	rm -rf .cache/
	mkdir .cache
	rm -rf node_modules/
	npm ci

.PHONY: stop
stop:
	docker-compose stop

.PHONY: start-api
start-api:
	cd ../backend && make start-detached
	sleep 10

.PHONY: start-api-root
start-api-root:
	cd ../backend && make start-detached-root
	sleep 10
