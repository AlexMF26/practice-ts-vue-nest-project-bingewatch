.PHONY: start
start: stop
	UID=$(shell id -u) ENTRY=start TYPE=node docker-compose up

.PHONY: start-root
start-root: stop
	UID=$(shell id -u) ENTRY=start TYPE=root docker-compose up

.PHONY: start-with-api
start-with-api: stop start-api
	UID=$(shell id -u) ENTRY=start TYPE=node docker-compose up

.PHONY: start-with-api-root
start-with-api-root: stop start-api-root
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

.PHONY: prepare-fast
prepare-fast: cleanup
	npm ci

.PHONY: prepare
prepare: cleanup
	npm i

.PHONY: cleanup
cleanup: stop
	rm -rf dist/
	rm -rf .quasar/
	rm -rf .cache/
	rm -rf node_modules/

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
