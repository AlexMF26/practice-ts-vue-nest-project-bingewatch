.PHONY: start
start:
	cd backend && make start-detached
	sleep 10
	cd frontend && make start

.PHONY: start-root
start-root:
	cd backend && make start-detached-root
	sleep 10
	cd frontend && make start-root

.PHONY: test
test:
	cd backend && make test
	cd frontend && make test

.PHONY: test-root
test-root:
	cd backend && make test-root
	cd frontend && make test-root

.PHONY: prepare-fast
prepare-fast:
	cd backend && make prepare-fast
	cd frontend && make prepare-fast

.PHONY: prepare
prepare:
	cd backend && make prepare
	cd frontend && make prepare

.PHONY: cleanup
cleanup:
	cd backend && make cleanup
	cd frontend && make cleanup