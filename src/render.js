import { debounce } from 'throttle-debounce'
import { getCurrentState } from './state'
import settings from './settings'

const { MAP_SIZE } = settings

let canvas = null
let context = null

export function initCanvasElement() {
    canvas = document.getElementById('game-canvas')
    context = canvas.getContext('2d')

    setCanvasDimensions()
}

function setCanvasDimensions() {
    const scaleRatio = Math.max(1, 800 / window.innerWidth)
    if (!canvas) return
    canvas.width = scaleRatio * window.innerWidth / 1.3
    canvas.height = scaleRatio * window.innerHeight / 1.2
}

window.addEventListener('resize', debounce(40, setCanvasDimensions))

let animationFrameRequestId

function render() {
    const { player, otherPlayers, foods } = getCurrentState()

    if (player) {
        renderBackground(player);
        renderBorder(player);
        renderPlayer(player, player);

        otherPlayers.forEach(renderPlayer.bind(null, player));
        foods.forEach(renderFood.bind(null, player));
    }

    animationFrameRequestId = requestAnimationFrame(render)
}

function renderBackground(player) {
    if (!canvas || !context) return

    renderBackgroundFirst();

    context.clearRect(0, 0, canvas.width, canvas.height);

    const canvasX = canvas.width / 2 - player.x
    const canvasY = canvas.height / 2 - player.y

    for (let i = 0; i < Math.round(MAP_SIZE / 50); i++) {
        for (let j = 0; j < Math.round(MAP_SIZE / 50); j++) {
            context.fillRect(canvasX + 50 * i, canvasY + 50 * j, 49, 49);
        }
    }
}

function renderBackgroundFirst() {
    if (!canvas || !context) return

    context.fillStyle = '#2b2f34'
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function renderBorder(player) {
    if (!canvas || !context) return
    context.strokeStyle = '#000000'
    context.lineWidth = 1
    context.strokeRect(canvas.width / 2 - player.x, canvas.height / 2 - player.y, MAP_SIZE, MAP_SIZE)
}

function renderPlayer(current, player) {
    if (!canvas || !context) return
    const { x, y, name, color, radius, mass } = player

    let currentX = 0;
    let currentY = 0;

    if (current) {
        currentX = current.x;
        currentY = current.y;
    }

    const canvasX = canvas.width / 2 + x - currentX
    const canvasY = canvas.height / 2 + y - currentY


    context.save()
    context.translate(canvasX, canvasY)

    context.beginPath()
    context.arc(0, 0, radius, 0, 2 * Math.PI, false)
    context.fillStyle = color
    context.fill()
    context.closePath()
    context.lineWidth = 2
    context.strokeStyle = '#000000'
    context.stroke()

    context.restore()

    context.fillStyle = color
    context.font = 'italic 14pt Arial'

    if (name) {
        context.fillText(name, canvasX - 30, canvasY - 20 - radius)
    }
    context.fillStyle = '#fff'
    context.font = 'italic 10pt Arial'
    context.fillText(mass.toFixed(2), canvasX - 15, canvasY - 5 - radius)
}

function renderFood(current, food) {
    if (!canvas || !context) return
    const { x, y, color, radius, mass } = food

    let currentX = 0;
    let currentY = 0;

    if (current) {
        currentX = current.x;
        currentY = current.y;
    }

    const canvasX = canvas.width / 2 + x - currentX
    const canvasY = canvas.height / 2 + y - currentY

    context.save()
    context.translate(canvasX, canvasY)

    context.beginPath()
    context.arc(0, 0, radius, 0, 2 * Math.PI, false)
    context.fillStyle = color
    context.fill()
    context.closePath()
    context.lineWidth = 1
    context.strokeStyle = '#000000'
    context.stroke()

    context.restore()

    context.fillStyle = '#fff'
    context.font = 'italic 10pt Arial'

    context.fillText(mass.toFixed(2), canvasX - 15, canvasY - 5 - radius)

}

function renderMainMenu() {
    renderBackgroundFirst()

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
