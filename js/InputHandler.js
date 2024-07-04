window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true
            break

        case 'a':
            keys.a.pressed = true
            break

        case 's':
            keys.s.pressed = true
            break

        case 'd':
            keys.d.pressed = true
            break

        case 'k':
            keys.k.pressed = true
            break

        case 'r':
            if (gameOverFlag) location.reload()
            break

        default:
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break

        case 'k':
            keys.k.pressed = false
            player.canFire = true
            player.recoilOffset = { x: 0, y: 0 }
            break

        default:
            break
    }
})
