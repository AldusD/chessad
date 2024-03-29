# Chess AD

[Leia esta página em português](https://github.com/AldusD/chessad/blob/main/README-pt.md)

[App Deploy](https://chessad.vercel.app)

Chess Arcane Dynasty: strategy, tatics and magic.

## About 

Chess AD is a online chess game that mix role-playing games universe with our beloved millennial game.
This project is the last and more important project of Driven Education's Full Stack Web Development Bootcamp. I found the idea of ​​ChessAD great for showing my knowledge and learning more about the following technologies:
- Single page applications with React (Create React APP, React-Browser-Router, React-Query)
- REST APIs with Express (Typescript, jest, supertest)
- NoSQL Database with MongoDb (Prisma ORM)
- in-memory data structure with Redis
- Real time client-server communication with Socket.io

## How to run for development

### Back-end:

1. Clone this repository
2. Install all dependencies 

```node
// in back/chess-ad-server
npm i
```

3. Create a MongoDB database
4. Create a redis database
5. Fill a`.env.development` or `.env` file according to the `.env.example` file
6. Run the back-end in a development environment:

```node
// in back/chess-ad-server
npm run dev
```

### Front-end:

1. Clone this repository
2. Install all dependencies 

```node
// in front/chess_ad_client/chess-ad-client
npm i
```

3. Run start command starting react app:

```node
// in front/chess_ad_client/chess-ad-client
npm start
```

## How to run tests

1. Follow the steps in the last section
2. Fill a `.env.test` file according to the `.env.example` file
3. Run test command:

```node
// in back/chess-ad-server
npm run test
```

## App limitations:

This is the first version of Chess Arcane Dynasty, some known issues of this version are:
- Layout are not responsive for mobile devices
- When reviewing games some visual effects of some spells (or spell pieces) will not appear as they were during the game in that move.
- All ties in the game are by agreement excluding force ties as in regular chess games. 
