# outro-bun

Ferramenta criada com o Bun para baixar as músicas da colação de grau, advindas de um CSV exportado de uma planilha.

## Uso

Arquivo `musicas.csv`:

```csv
Músicas para a entrada da colação de grau:,,,,,
Nome: ,,Link:,"Nome da Música (opcional, basta o link)",Início,Fim
```

```bash
bun run start
```

## Desenvolvimento

```
git clone https://github.com/guesant/outro-bun.git
cd outro-bun
```

### Serviços do [devops/development/docker-compose.yml](./devops/development/docker-compose.yml)

| Host    | Endereço | Descrição                               | Plataforma Base                              |
| ------- | -------- | --------------------------------------- | -------------------------------------------- |
| `outro` | `-`      | Aplicação NodeJS do module-autenticacao | `oven/bun:debian` + python 3;ffmpeg; yt-dlp; |

### Scripts Make

O projeto conta com um [arquivo make](./Makefile) que comporta scrips destinados ao desenvolvimento da aplicação.

```Makefile
dev-setup:
  # Configura o ambiente de deselvolvimento, como a criação da rede sisgea-net e os arquivos .env
dev-up:
  # Inicia os containers docker
dev-shell:
  # Inicia os containers docker e abre o bash na aplicação node
dev-down:
  # Para todos os containers
dev-logs:
  # Mostra os registros dos containers
```

### Aplicação [Bun](https://bun.sh/)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

This project was created using `bun init` in bun v1.0.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
