
build:
	yarn build:all

serve:
	yarn serve

dev: build serve

clean:
	yarn clear
	rm -rf build .docusaurus
