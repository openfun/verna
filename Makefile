# Verna's Makefile
#
# /!\ /!\ /!\ /!\ /!\ /!\ /!\ DISCLAIMER /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
#
# This Makefile is only meant to be used for DEVELOPMENT purpose as we are
# changing the user id that will run in the container.
#
# PLEASE DO NOT USE IT FOR YOUR CI/PRODUCTION/WHATEVER...
#
# /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
#
# Note to developers:
#
# While editing this file, please respect the following statements:
#
# 1. Every variable should be defined in the ad hoc VARIABLES section with a
#    relevant subsection
# 2. Every new rule should be defined in the ad hoc RULES section with a
#    relevant subsection depending on the targeted service
# 3. Rules should be sorted alphabetically within their section
# 4. When a rule has multiple dependencies, you should:
#    - duplicate the rule name to add the help string (if required)
#    - write one dependency per line to increase readability and diffs
# 5. .PHONY rule statement should be written after the corresponding rule

# ==============================================================================
# VARIABLES

# -- Docker
# Get the current user ID to use for docker run and docker exec commands
DOCKER_UID           = $(shell id -u)
DOCKER_GID           = $(shell id -g)
DOCKER_USER          = $(DOCKER_UID):$(DOCKER_GID)
COMPOSE              = DOCKER_USER=$(DOCKER_USER) docker-compose
COMPOSE_RUN          = $(COMPOSE) run --rm
COMPOSE_EXEC         = $(COMPOSE) exec
COMPOSE_EXEC_NODE    = $(COMPOSE_EXEC) node
COMPOSE_RUN_CROWDIN  = $(COMPOSE_RUN) crowdin crowdin

# -- Node
# We must run node with a /home because yarn tries to write to ~/.yarnrc. If the
# ID of our host user (with which we run the container) does not exist in the
# container (e.g. 1000 exists but 1009 does not exist by default), then yarn
# will try to write to "/.yarnrc" at the root of the system and will fail with a
# permission error.
COMPOSE_RUN_NODE     = $(COMPOSE_RUN) -e HOME="/tmp" node
YARN                 = $(COMPOSE_RUN_NODE) yarn

# ==============================================================================
# RULES

default: help

# -- Development
bootstrap: ## Install and build @openfun/verna
bootstrap: \
	install \
	build
.PHONY: bootstrap

build: ## Build @openfun/verna for production
	@$(YARN) build
.PHONY: build

install: ## Install dependencies
	@$(YARN) install
.PHONY: install-front

lint: ## Lint source code of all workspaces
	$(YARN) lint
.PHONY: lint

test: ## Run tests
	$(YARN) test
.PHONY: test

# -- Internationalization
crowdin-download: ## Download translated message from Crowdin
	@$(COMPOSE_RUN_CROWDIN) download -c crowdin/config.yml
.PHONY: crowdin-download

crowdin-upload: ## Upload source translations to Crowdin
	@$(COMPOSE_RUN_CROWDIN) upload sources -c crowdin/config.yml
.PHONY: crowdin-upload

i18n-compile: ## Compile the translations
	$(YARN) i18n:compile
.PHONY: i18n-compile

i18n-extract: ## Extracts the strings from the source code
	$(YARN) i18n:extract
.PHONY: i18n-extract

i18n-download-and-compile: ## Download then compile source translations from Crowdin
i18n-download-and-compile: \
	crowdin-download \
	i18n-compile
.PHONY: i18n-download-and-compile

i18n-extract-and-upload: ## Extract then upload source translations to Crowdin
i18n-extract-and-upload: \
	i18n-extract \
	crowdin-upload
.PHONY: i18n-extract-and-upload

# -- Help

help:
	@echo "$(BOLD)Verna Makefile$(RESET)"
	@echo "Please use 'make $(BOLD)target$(RESET)' where $(BOLD)target$(RESET) is one of:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help
