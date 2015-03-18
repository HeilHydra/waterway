BIN = ./node_modules/.bin

.PHONY: bootstrap lint test test-watch;

SRC = $(shell find ./lib ./test -type f -name '*.js')

lint:
	@$(BIN)/jscs $(SRC);
	@$(BIN)/jshint $(SRC);

bootstrap:
	@npm install

test: lint
	@NODE_ENV=test $(BIN)/mocha --recursive --require test/setup test/**/*Tests.js

test-watch: lint
	@NODE_ENV=test $(BIN)/mocha --watch --recursive --require test/setup test/**/*Tests.js