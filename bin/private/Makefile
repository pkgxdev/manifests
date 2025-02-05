MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
PKG_FILES := $(wildcard projects/**/package.yml)
OUTPUTS := $(PKG_FILES:projects/%=builds/pantry/projects/%)

# Default target
all: $(OUTPUTS)

# Rule to process each package.yml file
builds/pantry/projects/%: projects/%
	@mkdir -p $(dir $@)
	$(MAKEFILE_DIR)convert-pantry-yml.ts "$<" > "$@"
