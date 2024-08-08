# CommSensoRest

RestAPI para o projeto de extensão CommSenso do Instituto Federal de São Paulo - Campus Birigui. 

## Descrição do projeto
O projeto tem como objetivo atestar a qualidade de um processo de compostagem realizado no campus da faculdade através da coleta de dados utilizando alguns sensores para medição: 
- Temperatura
- Umidade
- Nitrogênio
- Potássio
- Fósforo
- Condutividade
- Ph

Depois de lidos, esses dados serão enviados para um Broker MQTT e então redirecionado para essa Rest API que lida diretamente com o armazenamento dos dados.

Mais definições e atribuições do projetos serão adicionadas posteriormente.


## Rotas da API

| Tipo   | Rota                 | Optional                             | Body                                                                                         | Descrição                                                                                         |
|--------|----------------------|--------------------------------------|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| GET    | /measure             | `sensor`, `container`, `limit`, `page` | N/A                                                                                          | Lista as medições com opções de filtrar por sensor, data, paginação e quantidade máxima de dados retornados. |
| POST   | /measure             | N/A                                  | `{"value": "number", "dtMeasure": "date string", "sensorId": "integer", "container": "string"}` | Cadastra uma nova medição.                                                                        |
| DELETE | /measure/:id         | N/A                                  | N/A                                                                                          | Deleta uma medição pelo seu ID.                                                                   |
| GET    | /container           | `page`, `limit`                      | N/A                                                                                          | Lista os containers cadastrados com opções de paginação e limite.                                 |
| POST   | /container           | N/A                                  | `{"name": "string", "weigth": "number"}`                                                     | Cadastra um novo container.                                                                       |
| PUT    | /container/:id       | N/A                                  | `{"name": "string", "weigth": "number", "valid": "boolean"}`                                 | Edita um container existente.                                                                     |
| DELETE | /container/:id       | N/A                                  | N/A                                                                                          | Deleta um container pelo seu ID.                                                                  |
| GET    | /sensores            | N/A                                  | N/A                                                                                          | Retorna todos os sensores cadastrados.                                                            |
| POST   | /sensores            | N/A                                  | `{"name": "string", "unit": "string"}`                                                       | Cadastra um novo tipo de sensor.                                                                  |
| PUT    | /sensores/:id        | N/A                                  | `{"name": "string", "unit": "string"}`                                                       | Edita um sensor específico.                                                                       |
| DELETE | /sensores/:id        | N/A                                  | N/A                                                                                          | Deleta um sensor específico pelo seu ID.                                                          |
