.PHONY: build serve dev clean run

build:
	yarn build:all

serve:
	yarn serve

dev: run

clean:
	yarn clear
	rm -rf build .docusaurus

run:
	corepack enable && yarn start --host 0.0.0.0 --locale en