export DIR_PACKAGES := packages
export DIR_WORKSPACE := build/workspace
export DIR_WORKSPACE_COMPILED := build/workspace/compiled
export DIR_WORKSPACE_PACKAGES := build/workspace/packages

.PHONY: default
default:
	#

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
	cd ${DIR_WORKSPACE} && npx jest  --verbose --colors --no-watchman

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
	build.compile.verify \
	build.root \
	build.root.verify \
	build.root.install

build: \
	build.clean \
	build.setup \
	build.compile \
	build.compile.clean \
	build.compile.verify \
	build.root \
	build.root.verify \


build.clean:
	rm -rf ${DIR_WORKSPACE}/*

build.setup:
	mkdir -p ${DIR_WORKSPACE}

build.compile:
	npx tsc -p build/tsconfig.json

build.compile.clean:
	rm -rf ${DIR_WORKSPACE_COMPILED}/index.js
	rm -rf ${DIR_WORKSPACE_COMPILED}/index.d.ts

	find ${DIR_WORKSPACE_COMPILED} -type f -name "*.test.js" -delete
	find ${DIR_WORKSPACE_COMPILED} -type f -name "*.test.d.ts" -delete

	find ${DIR_WORKSPACE_COMPILED} -type f -name "*.proof.js" -delete
	find ${DIR_WORKSPACE_COMPILED} -type f -name "*.proof.d.ts" -delete

	find ${DIR_WORKSPACE_COMPILED} -type f -name "examples/*" -delete
	find ${DIR_WORKSPACE_COMPILED} -type d -name "examples" -delete

build.compile.verify:
	test -d ${DIR_WORKSPACE_COMPILED}
	test -d ${DIR_WORKSPACE_COMPILED}/@phasma/handler
	test -d ${DIR_WORKSPACE_COMPILED}/@phasma/handler-aws

build.root:
	cp package.json ${DIR_WORKSPACE}/package.json
	cp package-lock.json ${DIR_WORKSPACE}/package-lock.json

build.root.verify:
	test -f ${DIR_WORKSPACE}/package.json
	test -f ${DIR_WORKSPACE}/package-lock.json

# This is an isolated target from main process that needs running manually in some cases.
# Will prepare the build directory by installing dependencies.
build.root.install:
	cd ${DIR_WORKSPACE} && npm ci --ignore-scripts

# --
# -- Package Build
# --

.PHONY: \
	package \
	package.variable \
	package.prepare \
	package.prepare.source \
	package.prepare.metadata \
	package.prepare.imports \
	package.preview

package: \
	package.variable \
	package.prepare \
	package.prepare.source \
	package.prepare.metadata \
	package.prepare.imports \
	package.preview

package.variable:
	test ! -z "${PACKAGE_NAME}"

package.prepare:
	mkdir -p ${DIR_WORKSPACE_PACKAGES}/${PACKAGE_NAME}

package.prepare.source:
	cp -R ${DIR_WORKSPACE_COMPILED}/${PACKAGE_NAME}/src/* ${DIR_WORKSPACE_PACKAGES}/${PACKAGE_NAME}

package.prepare.metadata:
	cp -R ${DIR_PACKAGES}/${PACKAGE_NAME}/package.json ${DIR_WORKSPACE_PACKAGES}/${PACKAGE_NAME}/package.json
	cp -R ${DIR_PACKAGES}/${PACKAGE_NAME}/README.md ${DIR_WORKSPACE_PACKAGES}/${PACKAGE_NAME}/README.md

package.prepare.imports:
	find ${DIR_WORKSPACE_PACKAGES} -type f \( -name '*.js' -o -name '*.ts' \) \
		-exec $(if $(shell which gsed),gsed,sed) -i -E 's|\/src\/index||g' {} \; \
		-exec $(if $(shell which gsed),gsed,sed) -i -E 's|\/src||g' {} \;

package.preview:
	npm publish --dry-run ${DIR_WORKSPACE_PACKAGES}/${PACKAGE_NAME}

# --
# -- Versioning
# --

.PHONY: \
	version.major \
	version.minor \
	version.patch

version.major:
	test ! -z "${${DIR_PACKAGES}}"
	npm version --no-git-tag-version -w ${DIR_PACKAGES}/${PACKAGE_NAME} major

version.minor:
	test ! -z "${${DIR_PACKAGES}}"
	npm version --no-git-tag-version -w ${DIR_PACKAGES}/${PACKAGE_NAME} minor

version.patch:
	test ! -z "${${DIR_PACKAGES}}"
	npm version --no-git-tag-version -w ${DIR_PACKAGES}/${PACKAGE_NAME} patch
