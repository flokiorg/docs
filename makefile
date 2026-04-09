
build:
	yarn build:all

serve:
	yarn serve

dev:
	./scripts/dev-all.sh

dev-single:
	yarn start --host 0.0.0.0

clean:
	yarn clear
	rm -rf build .docusaurus
