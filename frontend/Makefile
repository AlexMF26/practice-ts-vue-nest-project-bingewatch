.PHONY: start
start:
	UID=$(shell id -u) ENTRY=start TYPE=node docker-compose up

.PHONY: test
test:
	UID=$(shell id -u) ENTRY=test TYPE=node docker-compose up --exit-code-from app

.PHONY: update-api-interface
update-api-interface:
	UID=$(shell id -u) ENTRY=update-api-interface TYPE=node docker-compose up --abort-on-container-exit

.PHONY: build
build:
	docker build . --target production-stage --no-cache --force-rm -t production-app

.PHONY: start-root
start-root:
	UID=$(shell id -u) ENTRY=start TYPE=root docker-compose up

.PHONY: test-root
test-root:
	UID=$(shell id -u) ENTRY=test TYPE=root docker-compose up --exit-code-from app

.PHONY: update-api-interface-root
update-api-interface-root:
	UID=$(shell id -u) ENTRY=update-api-interface TYPE=root docker-compose up --abort-on-container-exit
