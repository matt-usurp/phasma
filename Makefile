export DIR_PACKAGES := packages
export DIR_BUILD_WORKSPACE := build/workspace
export DIR_BUILD_PACKAGE := build/package

.PHONY: default
default:
	#

# --
# -- Code Formatting
# --

.PHONY: \
	code \
	code.fix

code:
	npx eslint \
		--cache \
		--cache-location .eslintcache \
		--format codeframe \
			./packages

code.fix:
	npx eslint \
		--cache \
		--cache-location .eslintcache \
		--fix \
		--format codeframe \
			./packages

# --
# -- Testing
# --

.PHONY: \
	test \
	test.coverage.open \
	test.build

test:
	npx jest --verbose --colors

test.coverage.open:
	open build/coverage/index.html

# Assumes the dependencies have been installed or placed before running.
# This will require that the workspaces are linked so cross-package references work.
test.build:
	cd ./${DIR_BUILD_WORKSPACE} && npx jest  --verbose --colors --no-watchman

# --
# -- Package Build
# --

.PHONY: \
	build \
	build.clean \
	build.setup \
	build.compile \
	build.compile.clean \
	build.compile.packages \
	build.compile.verify

build: \
	build.clean \
	build.setup \
	build.compile \
	build.compile.clean \
	build.compile.verify

build.clean:
	rm -rf ./${DIR_BUILD_WORKSPACE}/*

build.setup:
	mkdir -p ./${DIR_BUILD_WORKSPACE}

build.compile:
	npx tsc -p build/tsconfig.json

build.compile.clean:
	rm -rf ./${DIR_BUILD_WORKSPACE}/index.js
	rm -rf ./${DIR_BUILD_WORKSPACE}/index.d.ts

	find ./${DIR_BUILD_WORKSPACE} -type f -name "*.test.js" -delete
	find ./${DIR_BUILD_WORKSPACE} -type f -name "*.test.d.ts" -delete

	find ./${DIR_BUILD_WORKSPACE} -type f -name "*.proof.js" -delete
	find ./${DIR_BUILD_WORKSPACE} -type f -name "*.proof.d.ts" -delete

build.compile.verify:
	test -d ./${DIR_BUILD_WORKSPACE}
	test -d ./${DIR_BUILD_WORKSPACE}/@phasma/handler
	test -d ./${DIR_BUILD_WORKSPACE}/@phasma/handler-aws

# This is an isolated target from main process that needs running manually in some cases.
# Will prepare the build directory by installing dependencies.
build.root.install:
	cd ./${DIR_BUILD_WORKSPACE} && npm ci --ignore-scripts

# --
# -- Package Build
# --

.PHONY: \
	package \
	package.assert \
  package.clean \
	package.prepare \
	package.prepare.source \
	package.prepare.metadata \
	package.prepare.imports \
	package.preview

package: \
	package.assert \
  package.clean \
	package.prepare \
	package.prepare.source \
	package.prepare.metadata \
	package.prepare.imports \
	package.preview

package.assert:
	test ! -z "${PACKAGE_NAME}"
	test -d ./${DIR_BUILD_WORKSPACE}/${PACKAGE_NAME}

package.clean:
	rm -rf ./${DIR_BUILD_PACKAGE}/*

package.prepare:
	mkdir -p ./${DIR_BUILD_PACKAGE}

package.prepare.source:
	cp -R ./${DIR_BUILD_WORKSPACE}/${PACKAGE_NAME}/src/* ./${DIR_BUILD_PACKAGE}

package.prepare.metadata:
	cp ./${DIR_PACKAGES}/${PACKAGE_NAME}/package.json ./${DIR_BUILD_PACKAGE}/package.json
	cp ./${DIR_PACKAGES}/${PACKAGE_NAME}/README.md ./${DIR_BUILD_PACKAGE}/README.md

package.prepare.imports:
	find ${DIR_BUILD_PACKAGE} -type f \( -name '*.js' -o -name '*.ts' \) \
		-exec $(if $(shell which gsed),gsed,sed) -i -E 's|\/src\/index||g' {} \; \
		-exec $(if $(shell which gsed),gsed,sed) -i -E 's|\/src||g' {} \;

package.preview:
	npm publish --dry-run ./${DIR_BUILD_PACKAGE}

package.publish:
	npm publish --access public ./${DIR_BUILD_PACKAGE}

# --
# -- Versioning
# --

.PHONY: \
  version.assert \
	version.major \
	version.minor \
	version.patch

version.assert:
	test ! -z "${PACKAGE_NAME}"

version.major: version.assert
	npm version --no-git-tag-version -w ${DIR_PACKAGES}/${PACKAGE_NAME} major

version.minor: version.assert
	npm version --no-git-tag-version -w ${DIR_PACKAGES}/${PACKAGE_NAME} minor

version.patch: version.assert
	npm version --no-git-tag-version -w ${DIR_PACKAGES}/${PACKAGE_NAME} patch

# --
# -- Packages
# --

.PHONY: \
  phasma \
  create-phasma \
  @phasma/handler \
  @phasma/handler-aws

phasma:
	$(MAKE) build package PACKAGE_NAME=$@

create-phasma:
	$(MAKE) build package PACKAGE_NAME=$@

@phasma/handler:
	$(MAKE) build package PACKAGE_NAME=$@

@phasma/handler-aws:
	$(MAKE) build package PACKAGE_NAME=$@
