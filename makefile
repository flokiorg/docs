

dev:
	corepack enable && yarn start --host 0.0.0.0

package:
	docker build --target caddy -t ghcr.io/flokiorg/docs:latest .
	docker push ghcr.io/flokiorg/docs:latest
	