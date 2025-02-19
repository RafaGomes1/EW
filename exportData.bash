#!/bin/bash

# Verifica se os diretórios backups e exports existem, se não, cria-os
if [ ! -d "./backups" ]; then
    mkdir -p ./backups
    echo "Diretório ./backups criado."
fi

if [ ! -d "./exports" ]; then
    mkdir -p ./exports
    echo "Diretório ./exports criado."
fi

# Exportar dados do MongoDB
echo "A exportar dados do mongodb..."
docker exec mongodb /bin/sh -c "mongoexport --host mongodb --db proj --collection curso --out /tmp/exports/curso.json --jsonArray &&
      mongoexport --host mongodb --db proj --collection noticia --out /tmp/exports/noticia.json --jsonArray &&
      mongoexport --host mongodb --db proj --collection publicacao --out /tmp/exports/publicacao.json --jsonArray &&
      mongoexport --host mongodb --db proj --collection recurso --out /tmp/exports/recurso.json --jsonArray &&
      mongoexport --host mongodb --db proj --collection tipo --out /tmp/exports/tipo.json --jsonArray &&
      mongoexport --host mongodb --db proj --collection user --out /tmp/exports/user.json --jsonArray"
echo "Exportação realizada com sucesso!"

# Copiar arquivos exportados do container para a máquina host
echo "A copiar os ficheiros para a máquina host..."
docker cp mongodb:/tmp/exports ./exports/dataset
echo "Dados do mongodb copiados com sucesso!"

# Copiar arquivos do container da app para a máquina host
docker cp app:/usr/src/app/public/fileStore/ ./exports/files
echo "Recursos guardados na fileStore copiados com sucesso!"

echo "A comprimir arquivos..."
# Compactar os arquivos exportados em um arquivo zip com a data de hoje
zip -r "./backups/backup_$(date +%Y%m%d_%Hh%M).zip" ./exports

echo "Backup backup_$(date +%Y%m%d_%Hh%M).zip criado com sucesso na pasta backups..."

echo "A apagar ficheiros da pasta exports.."
rm -rf ./exports

echo "Exportação completa!"
