# Projeto: Funcionalidades para Instituto

Arquivos incluídos:

- `features.csv`: Lista das funcionalidades propostas com colunas: Categoria, Funcionalidades Principais, Tecnologia Base, Benefícios para o Instituto.
- `main.py`: Script de exemplo que carrega `features.csv` e imprime uma tabela legível no console.

Como executar:

Opção A — Python (se instalado):

1. Tenha Python 3.7+ instalado.
2. No Windows PowerShell, rode:

```
python .\main.py
```

Opção B — PowerShell (sem Python):

1. Abra PowerShell na pasta do projeto.
```markdown
# Projeto: Funcionalidades para Instituto

Arquivos incluídos:

- `features.csv`: Lista das funcionalidades propostas com colunas: Categoria, Funcionalidades Principais, Tecnologia Base, Benefícios para o Instituto.
- `main.py`: Agora atua como um pequeno servidor HTTP (std lib) que serve o front-end e endpoints JSON.

Como executar (recomendado):

1. Tenha Python 3.7+ instalado.
2. No Windows PowerShell, rode:

```
python .\main.py
```

Abra então http://localhost:8000/ no navegador.

Endpoints principais:

- GET /api/features -> JSON com as linhas de `features.csv`.
- POST /api/report -> multipart/form-data: fields `name`, `anonymous` (on), `description`, `lat`, `lon`, `photo` (file). Salva em `data/reports.jsonl` e `data/uploads`.

Notas:

- O servidor não implementa autenticação nem validação avançada — é um protótipo local.
- Para produção, recomendo migrar para um framework (Flask/FastAPI) e adicionar segurança.

```
