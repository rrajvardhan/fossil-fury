const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const bg = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/bg.png',
})

const lvl = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/level.png',
})

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    k: {
        pressed: false,
    },
}

const player = new Player({
    collisionBlocks,
    imageSrc: './assets/kuro/idle.png',
    frameRate: 3,
    frameBuffer: 8,
    scale: 4,
    animations: {
        playerIdle: {
            imageSrc: './assets/kuro/idle.png',
            frameRate: 3,
            frameBuffer: 8,
        },
        playerMove: {
            imageSrc: './assets/kuro/move.png',
            frameRate: 6,
            frameBuffer: 6,
        },
        playerHurt: {
            imageSrc: './assets/kuro/hurt.png',
            frameRate: 4,
            frameBuffer: 4,
        },
        playerDead: {
            imageSrc: './assets/kuro/dead.png',
            frameRate: 5,
            frameBuffer: 6,
        },
    },
})

function healthBar() {
    const width = canvas.width / 10
    const height = 16

    let healthLeft = player.health
    for (let i = 0; i < healthLeft; i++) {
        ctx.fillRect(i * width, 0, width, height)
    }
}

function gameOver() {
    gameOverFlag = true
    console.log('Game Over')
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'white'
    ctx.font = '48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2)

    ctx.font = '24px sans-serif'
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50)
}
let gameOverFlag = false

function main() {
    if (!gameOverFlag) {
        window.requestAnimationFrame(main)
    }

    ctx.fillStyle = 'rgb(39, 39, 39)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (gameOverFlag) {
        gameOver()
        return
    }

    bg.draw()
    lvl.draw()

    cannons.forEach((cannon) => {
        cannon.update()
    })

    if (player.position.x < 400 && keys.d.pressed) {
        player.velocity.x = 5
    } else if (player.position.x < 400 && keys.a.pressed) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.d.pressed) {
            collisionBlocks.forEach((block) => {
                block.position.x -= 5
            })
            cannons.forEach((cannon) => {
                cannon.position.x -= 5
            })
            lvl.position.x -= 5
        } else if (keys.a.pressed) {
            collisionBlocks.forEach((block) => {
                block.position.x += 5
            })
            cannons.forEach((cannon) => {
                cannon.position.x += 5
            })
            lvl.position.x += 5
        }
    }

    player.projectiles.forEach((projectile, projectileIndex) => {
        cannons.forEach((cannon, cannonIndex) => {
            if (
                projectile.hitbox.position.x > cannon.hitbox.position.x &&
                projectile.hitbox.position.x + projectile.hitbox.width <
                    cannon.hitbox.position.x + cannon.hitbox.width &&
                projectile.hitbox.position.y > cannon.hitbox.position.y &&
                projectile.hitbox.position.y <
                    cannon.hitbox.position.y + cannon.hitbox.height
            ) {
                console.log('hit')
                player.projectiles.splice(projectileIndex, 1)

                cannon.health--
                if (cannon.health <= 0) {
                    cannons.splice(cannonIndex, 1)
                }
            }
        })
    })

    cannons.forEach((cannon, cannonIndex) => {
        cannon.projectiles.forEach((enemyProjectile, enemyIndex) => {
            if (
                player.hitbox.position.x <
                    enemyProjectile.hitbox.position.x +
                        enemyProjectile.hitbox.width &&
                player.hitbox.position.x + player.hitbox.width >
                    enemyProjectile.hitbox.position.x &&
                player.hitbox.position.y <
                    enemyProjectile.hitbox.position.y +
                        enemyProjectile.hitbox.height &&
                player.hitbox.position.y + player.hitbox.height >
                    enemyProjectile.hitbox.position.y
            ) {
                cannon.projectiles.splice(enemyIndex, 1)
                player.takeDamage()
            }
        })
    })

    player.handleInput(keys)
    player.update()

    healthBar()
}

main()
