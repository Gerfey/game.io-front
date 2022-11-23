import {debounce} from 'throttle-debounce'
import {getCurrentState} from './state'
import settings from './settings'

const {MAP_SIZE} = settings

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
    const {me, others, foods} = getCurrentState()
    if (me) {
        renderBackground(me)
        renderBorder(me)

        renderPlayer(me, me)
        others.forEach(renderPlayer.bind(null, me));
        foods.forEach(renderFood.bind(null, me));
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
    context.fillStyle = '#2b2f34'
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function renderBorder(player) {
    if (!canvas || !context) return
    context.strokeStyle = '#000000'
    context.lineWidth = 1
    context.strokeRect(canvas.width / 2 - player.x, canvas.height / 2 - player.y, MAP_SIZE, MAP_SIZE)
}

function renderPlayer(me, player) {
    if (!canvas || !context) return
    const {x, y, username, color, radius, mass} = player

    const canvasX = canvas.width / 2 + x - me.x
    const canvasY = canvas.height / 2 + y - me.y

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

    if (username) {
        context.fillText(username, canvasX - 30, canvasY - 20 - radius)
    }
    context.fillStyle = '#fff'
    context.font = 'italic 10pt Arial'
    context.fillText(mass.toFixed(2), canvasX - 15, canvasY - 5 - radius)
}

function renderFood(me, food) {
    if (!canvas || !context) return
    const {x, y, color, radius, mass} = food

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
