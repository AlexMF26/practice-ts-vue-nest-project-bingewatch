.PHONY: start
start:
	UID=$(shell id -u) ENTRY=start:development TYPE=node docker-compose up

.PHONY: test
test:
	UID=$(shell id -u) ENTRY=test TYPE=node docker-compose up --exit-code-from api

.PHONY: migration
migration:
	UID=$(shell id -u) ENTRY=migration TYPE=node docker-compose up --abort-on-container-exit

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-api

.PHONY: start-root
start-root:
	UID=$(shell id -u) ENTRY=start:development TYPE=root docker-compose up

.PHONY: test-root
test-root:
	UID=$(shell id -u) ENTRY=test TYPE=root docker-compose up  --exit-code-from api

.PHONY: migration-root
migration-root:
	UID=$(shell id -u) ENTRY=migration TYPE=root docker-compose up --abort-on-container-exit
