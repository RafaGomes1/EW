#!/bin/bash

# Verifica se um nome de arquivo zip foi fornecido como argumento
if [ -z "$1" ]; then
    echo "Por-favor insira o nome do ficheiro de backup como argumento. Exemplo: $0 <nome-do-arquivo-zip>"
    exit 1
fi

# Nome do arquivo zip passado como argumento
ZIP_FILENAME="$1"

# Verifica se o arquivo zip existe na pasta backups
if [ ! -f "./backups/$ZIP_FILENAME" ]; then
    echo "Ficheiro ./backups/$ZIP_FILENAME não encontrado."
    exit 1
fi

# Verifica se o diretório import existe, se não, cria-o
if [ ! -d "./import" ]; then
    mkdir -p ./import
    echo "Diretoria ./import criado."
fi

# Extrai o Ficheiro zip para a pasta import
echo "A extrair o conteudo do ficheiro $ZIP_FILENAME para a pasta ./import..."
unzip "./backups/$ZIP_FILENAME" -d ./import
echo "Extração concluída."

# Copiar Ficheiros extraídos para os containers Docker
echo "A copiar os ficheiros para os containers Docker..."

# Copiar Ficheiros do dataset para o container mongodb
docker cp ./import/exports/datasets mongodb:/tmp/restore
docker exec mongodb /bin/sh -c "mongoimport --host mongodb --db proj --collection curso --drop --file /tmp/restore/curso.json --jsonArray &&
                                mongoimport --host mongodb --db proj --collection noticia --drop --file /tmp/restore/noticia.json --jsonArray &&
                                mongoimport --host mongodb --db proj --collection publicacao --drop --file /tmp/restore/publicacao.json --jsonArray &&
                                mongoimport --host mongodb --db proj --collection recurso --drop --file /tmp/restore/recurso.json --jsonArray &&
                                mongoimport --host mongodb --db proj --collection tipo --drop --file /tmp/restore/tipo.json --jsonArray &&
                                mongoimport --host mongodb --db proj --collection user --drop --file /tmp/restore/user.json --jsonArray"
echo "Dados importados para o MongoDB com sucesso."

# Copiar Ficheiros da fileStore para o container app
docker cp ./import/exports/files app:/usr/src/app/public/fileStore
echo "Ficheiros copiados para o container app com sucesso."

# # Limpa a pasta import
# rm -rf ./import

echo "Importação de dados concluida!"