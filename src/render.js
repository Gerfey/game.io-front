import { debounce } from 'throttle-debounce'
import { getCurrentState } from './state'
import settings from './settings'

const { MAP_SIZE } = settings

const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

setCanvasDimensions()

function setCanvasDimensions() {
  const scaleRatio = Math.max(1, 800 / window.innerWidth)
  if (!canvas) return
  canvas.width = scaleRatio * window.innerWidth / 1.3
  canvas.height = scaleRatio * window.innerHeight / 1.2
}

window.addEventListener('resize', debounce(40, setCanvasDimensions))

let animationFrameRequestId

function render() {
  const { me, others, foods } = getCurrentState()
  if (me) {
    renderBackground()
    renderBorder(me)

    renderPlayer(me, me)
    others.forEach(renderPlayer.bind(null, me));
    foods.forEach(renderFood.bind(null, me));
  }

  animationFrameRequestId = requestAnimationFrame(render)
}

function renderBackground() {
  if (!canvas || !context) return
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function renderBorder(player) {
  if (!canvas || !context) return
  context.strokeStyle = 'black'
  context.lineWidth = 1
  context.strokeRect(canvas.width / 2 - player.x, canvas.height / 2 - player.y, MAP_SIZE, MAP_SIZE)
}

function renderPlayer(me, player) {
  if (!canvas || !context) return
  const { x, y, username, color, radius } = player

  const canvasX = canvas.width / 2 + x - me.x
  const canvasY = canvas.height / 2 + y - me.y

  context.save()
  context.translate(canvasX, canvasY)

  context.beginPath()
  context.arc(0, 0, radius, 0, 2 * Math.PI, false)
  context.fillStyle = color
  context.fill()
  context.closePath()
  context.lineWidth = 4
  context.strokeStyle = '#003300'
  context.stroke()

  context.restore()

  context.fillStyle = color
  context.font = 'italic 16pt Arial'
  context.fillText(username, canvasX - 35, canvasY - 30 - radius)
}

function renderFood(me, food) {
  if (!canvas || !context) return
  const { x, y, color, radius } = food

  const canvasX = canvas.width / 2 + x - me.x
  const canvasY = canvas.height / 2 + y - me.y

  context.save()
  context.translate(canvasX, canvasY)

  context.beginPath()
  context.arc(0, 0, radius, 0, 2 * Math.PI, false)
  context.fillStyle = color
  context.fill()
  context.closePath()
  context.lineWidth = 1
  context.strokeStyle = '#999999'
  context.stroke()

  context.restore()
}

function renderMainMenu() {
  renderBackground()

  animationFrameRequestId = requestAnimationFrame(renderMainMenu)
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu)

export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId)
  animationFrameRequestId = requestAnimationFrame(render)
}

export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId)
  animationFrameRequestId = requestAnimationFrame(renderMainMenu)
}
