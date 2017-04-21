DIST = dist
SRC = $(shell ls *.js)

BABEL = ./node_modules/.bin/babel
NODE_SASS = ./node_modules/.bin/node-sass

.PHONY: build
build: $(foreach i,$(SRC),$(DIST)/$(notdir $i))

.PHONY: publish
publish: clean build
	npm publish

.PHONY: clean
clean:
	rm -rf $(DIST)

$(DIST):
	mkdir -p $(DIST)

# To make each transpiled file, compile the source file with the same name
# ie, index.js => dist/index.js
$(DIST)/%.js: $(DIST)
	$(BABEL) $(@F) \
		--ignore=node_modules,$(DIST) \
		--presets=babel-preset-es2015,babel-preset-react \
		--plugins=babel-plugin-transform-object-rest-spread \
		> $@
