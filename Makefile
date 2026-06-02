.PHONY: install dev build lint preview docker-build clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

preview: build
	npm run preview

docker-build:
	docker build -t ghost-identification-system .

clean:
	rm -rf dist node_modules
