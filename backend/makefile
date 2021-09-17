#!make
# ########################################################## #
# Makefile for Golang Project
# Includes cross-compiling, installation, cleanup
# ########################################################## #
include .env
# Check for required command tools to build or stop immediately
EXECUTABLES = git go find pwd curl
K := $(foreach exec,$(EXECUTABLES),\
				$(if $(shell which $(exec)),some string,$(error "No $(exec) in PATH")))

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
SOURCE_FILE=server/main.go
BUILD_FOLDER=bin
DIST_FOLDER=dist
BINARY_NAME=stl-vaporwave
VERSION:=$(shell git describe --tags --abbrev=0)
BUILD:=$(shell git rev-parse HEAD)
PLATFORMS=darwin linux windows
ARCHITECTURES=amd64
# Setup linker flags option for build that interoperate with variable names in src code
LDFLAGS=-ldflags "-X main.Version=$(VERSION) -X main.Build=$(BUILD)"

default: build

all: clean install build release

build:
	cd server && rice embed-go 
	go build $(LDFLAGS) -o $(BUILD_FOLDER)/$(BINARY_NAME) $(SOURCE_FILE)
	cd server && rice append --exec ../$(BUILD_FOLDER)/$(BINARY_NAME)
	chmod +x $(BUILD_FOLDER)/$(BINARY_NAME)

clean_build:
	find $(ROOT_DIR)/$(BUILD_FOLDER) -name $(BINARY_NAME) -delete

release: clean_release
	$(foreach GOOS, $(PLATFORMS),\
		$(foreach GOARCH, $(ARCHITECTURES),\
		  $(shell export GOOS=$(GOOS); export GOARCH=$(GOARCH); go build -o $(DIST_FOLDER)/$(BINARY_NAME)-$(GOOS)-$(GOARCH) $(SOURCE_FILE); cd server && rice append --exec ../$(DIST_FOLDER)/$(BINARY_NAME)-$(GOOS)-$(GOARCH))))
	gzip $(DIST_FOLDER)/* 
	ghr -t $(GITHUB_TOKEN) --replace --draft $(VERSION) $(DIST_FOLDER)

clean_release: 
	find $(ROOT_DIR)/$(DIST_FOLDER) -name '$(BINARY_NAME)[-?][a-zA-Z0-9]*[-?][a-zA-Z0-9]*' -delete

install:
	curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s
	go get -d github.com/GeertJohan/go.rice/rice
	go install github.com/tcnksm/ghr@latest	
	go install $(LDFLAGS) $(SOURCE_FILE)

dev:
	./$(BUILD_FOLDER)/air

clean: clean_release clean_build
	find $(ROOT_DIR)/$(BUILD_FOLDER) -name air -delete

.PHONY: default all build clean_build release clean_release install dev clean