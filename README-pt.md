# Chess AD

[Read this page in english](https://github.com/AldusD/chessad/blob/main/README.md)

Chess Arcane Dynasty: estratégia, tatica e magia.

## Sobre

Chess AD é um jogo online de xadrez que mistura o universo dos role-playing games com nosso amado jogo milenar.
Este projeto é o último e mais importante projeto do Bootcamp de Desenvolvimento Web Full Stack da Driven Education. Eu considerei a ideia do ChessAD ótima para mostrar os meus conhecimentos e aprender mais sobre as seguintes tecnologias e habilidades:
- Single page applications com React (Create React APP, React-Browser-Router, React-Query)
- APIs REST com Express (Typescript, jest, supertest)
- Bancos de dados NoSQL com MongoDb (Prisma ORM)
- Banco de dados em memória primária com Redis
- Comunicação cliente-servidor em tempo real com Socket.io

## Como executar em ambiente de desenvolvimento

### Back-end:

1. Clone esse repositório
2. Instale todas as dependencies 

```node
// back/chess-ad-server
npm i
```

3. Crie um banco de dados MongoDB
4. Crie um banco de dados Redis
5. Preencha um arquivo `.env.development`ou `.env` de acordo com o arquivo `.env.example`
6. Execute o back-end em ambiente de desenvolvimento:

```node
// back/chess-ad-server
npm run dev
```

### Front-end:

1. Clone esse repositório
2. Instale todas as dependencies 

```node
// front/chess_ad_client/chess-ad-client
npm i
```

3. Execute o comando start para iniciar a aplicação React:

```node
// front/chess_ad_client/chess-ad-client
npm start
```

## Como testar a API

1. Siga os passos da seção anterior
2. Preencha um arquivo `.env.test` de acordo com o arquivo `.env.example`
3. Execute o comando test:

```node
// back/chess-ad-server
npm run test
```

## Limitações da Aplicação:

Essa é a primeira versão de Chess Arcane Dynasty, alguns problemas conhecidos dessa versão são:
- Falta de responsividade para dispositivos móveis
- Ao revisar partidas alguns efeitos visuais de spells ou (peças de spells) não aparecem como estavam durante a partida naquele lance.
- Todo empate é por comum acordo o que exclui os empates forçados numa partida regular de xadrez. 
