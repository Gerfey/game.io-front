const settings = Object.freeze({
  GAME: {
    HOST: '1102677-cd94767.tmweb.ru:8080'
  },
  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
    DISCONNECT: 'disconnect'
  }
})

export default settings;
