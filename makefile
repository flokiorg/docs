

dev:
	docker run -it --rm \
	-v $(shell pwd):/app \
	-p 3001:3000 \
	-w /app \
	node:lts bash 

run:
	corepack enable && yarn start --host 0.0.0.0

package:
	docker build --target caddy -t ghcr.io/flokiorg/docs:latest .
	docker push ghcr.io/flokiorg/docs:latest
	