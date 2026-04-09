
build:
	yarn build:all

serve:
	yarn serve

dev: build serve

clean:
	yarn clear
	rm -rf build .docusaurus

run:
	corepack enable && yarn start --host 0.0.0.0