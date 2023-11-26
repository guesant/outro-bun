dev-setup:

	$(shell (cd devops/development; find . -type f -name "*.example" -exec sh -c 'cp -n {} $$(basename {} .example)' \;))

dev-up:
	make dev-setup;
	sudo docker compose --file devops/development/docker-compose.yml -p guesant-outro up --build -d --remove-orphans;

dev-shell:
	make dev-up;
	sudo docker compose --file devops/development/docker-compose.yml -p guesant-outro exec outro bash;

dev-down:
	sudo docker compose --file devops/development/docker-compose.yml -p guesant-outro stop

dev-logs:
	sudo docker compose --file devops/development/docker-compose.yml -p guesant-outro logs -f
