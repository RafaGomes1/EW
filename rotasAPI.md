# Rotas definidas para a REST API

## Noticia

GET `/noticia` -> Lista todas as noticias (ordenadas por data de Criação)
GET `/noticia/:id` -> Devolve a noticia com o id `:id`
POST `/noticia` -> Adiciona uma nova noticia
PUT `/noticia/:id` -> Atualiza a informação da noticia com id `:id`
DELETE `/noticia/:id` -> Apaga a noticia com id `:id`

## Recurso

GET `/recurso` -> Lista todos os recursos (ordenados por data de Registo)
GET `/recurso?tipo=XXXX` -> Lista todos os recursos com o id do Tipo XXXX
GET `/recurso?autor=XXXX` -> Lista todos os recursos com o autor XXXX
GET `/recurso?produtor=XXXX` -> Lista todos os recursos com o id do produtor XXXX
GET `/recurso/:id/` -> Devolve o recurso com o id `:id`
GET `/recurso/tipos` -> Lista todos os tipos existentes
GET `/recurso/tipos/:id` -> Devolve o tipo com o id `:id`

POST `/recurso` -> Adiciona um novo recurso
PUT `/recurso/:id` -> Altera a informação de um recurso pelo seu id
DELETE `/recurso/:id` -> Apaga o registo de um recurso pelo seu id

POST `/recurso/tipos` -> Adiciona um novo tipo de recurso
PUT `/recursos/tipos/:id` -> Altera a informação de um tipo de recurso pelo seu id
DELETE `/recursos/tipos/:id` -> Apaga a informação de um tipo de recurso pelo seu id (Já possui uma verificação para só apagar caso não exista nenhum recurso desse tipo.)