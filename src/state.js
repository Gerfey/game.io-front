import { updateLeaderboard } from './leaderboard'

const RENDER_DELAY = 100

const gameUpdates = []

let gameStart = 0

let firstServerTimestamp = 0

export function initState() {
  gameStart = 0
  firstServerTimestamp = 0
}

export function processGameUpdate(update) {
  if (!firstServerTimestamp) {
    firstServerTimestamp = update.time
    gameStart = Date.now()
  }
  gameUpdates.push(update)

  updateLeaderboard(update.leaderboard)

  const base = getBaseUpdate()
  if (base > 0) {
    gameUpdates.splice(0, base)
  }
}

function currentServerTime() {
  return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY
}

function getBaseUpdate() {
  const serverTime = currentServerTime()

  for (let i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].time <= serverTime) {
      return i
    }
  }
  return -1
}

export function getCurrentState() {
  if (!firstServerTimestamp) {
    return {}
  }

  const base = getBaseUpdate()
  const serverTime = currentServerTime()

  if (base < 0 || base === gameUpdates.length - 1) {
    return gameUpdates[gameUpdates.length - 1]
  } else {
    const baseUpdate = gameUpdates[base]
    const next = gameUpdates[base + 1]
    const ratio = (serverTime - baseUpdate.time) / (next.time - baseUpdate.time)

    return {
      player: interpolateObject(baseUpdate.player, next.player, ratio),
      otherPlayers: interpolateObjectArray(baseUpdate.otherPlayers, next.otherPlayers, ratio),
      foods: interpolateObjectArray(baseUpdate.foods, next.foods, ratio)
    }
  }
}

function interpolateObject(object1, object2, ratio) {
  if (!object2) {
    return object1
  }

  const interpolated = { ...object1 }
  Object.entries(interpolated).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      interpolated[key] = object2[key]
    } else {
      const value1 = object1[key]
      const value2 = object2[key]
      interpolated[key] = value1 + (value2 - value1) * ratio
    }
  })

  return interpolated
}

function interpolateObjectArray(objects1, objects2, ratio) {
  return objects1.map(o => interpolateObject(o, objects2.find(o2 => o.id === o2.id), ratio))
}
