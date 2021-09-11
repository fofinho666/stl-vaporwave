# ########################################################## #
# Makefile for Golang Project
# Includes cross-compiling, installation, cleanup
# ########################################################## #

# Check for required command tools to build or stop immediately
EXECUTABLES = git go find pwd curl
K := $(foreach exec,$(EXECUTABLES),\
        $(if $(shell which $(exec)),some string,$(error "No $(exec) in PATH")))

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
SOURCE_FILE=server/main.go
BUILD_FOLDER=bin
BINARY=stl-vaporwave
VERSION=0.0.1
BUILD=`git rev-parse HEAD`
PLATFORMS=darwin linux windows
ARCHITECTURES=386 amd64
# Setup linker flags option for build that interoperate with variable names in src code
LDFLAGS=-ldflags "-X main.Version=${VERSION} -X main.Build=${BUILD}"

default: build

all: clean install install_air build_all

build:
	cd server && rice embed-go 
	go build ${LDFLAGS} -o ${BUILD_FOLDER}/${BINARY} ${SOURCE_FILE}

build_all:
	cd server && rice embed-go 
	$(foreach GOOS, $(PLATFORMS),\
		$(foreach GOARCH, $(ARCHITECTURES),\
			$(shell export GOOS=$(GOOS); export GOARCH=$(GOARCH); go build -v -o ${BUILD_FOLDER}/${BINARY}-$(GOOS)-$(GOARCH) ${SOURCE_FILE})))

install:
	curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s
	go get -d github.com/GeertJohan/go.rice/rice
	go install ${LDFLAGS} ${SOURCE_FILE}
	
dev:
	./${BUILD_FOLDER}/air

# Remove only what we've created
clean:
	find ${ROOT_DIR}/${BUILD_FOLDER} -name '${BINARY}[-?][a-zA-Z0-9]*[-?][a-zA-Z0-9]*' -delete
	find ${ROOT_DIR}/${BUILD_FOLDER} -name ${BINARY} -delete
	find ${ROOT_DIR}/${BUILD_FOLDER} -name air -delete

.PHONY: check clean install build_all all