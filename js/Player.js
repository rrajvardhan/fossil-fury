class Player extends Sprite {
    constructor({
        imageSrc,
        frameRate,
        frameBuffer,
        scale,
        animations,
        collisionBlocks = [],
    }) {
        super({ imageSrc, frameRate, frameBuffer, scale, animations })

        this.health = 10

        this.position = {
            x: 0,
            y: 0,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.collisionBlocks = collisionBlocks

        this.gravity = 1

        this.hitbox = {
            position: {
                x: this.position.x - 20 + (this.width * this.scale) / 2,
                y: this.position.y + 18,
            },
            width: 55,
            height: 65,
        }

        this.isHurt = false
        this.hurtAnimationComplete = true // Track if hurt animation is complete

        this.canJump = true
        this.jumpSize = -17

        this.currentDirection = 'right'
        this.projectiles = []

        this.canFire = true // Flag to indicate if player can fire
        this.recoilOffset = { x: 0, y: 0 } // Recoil offset

        this.gun = new Sprite({
            position: {
                x: this.position.x - 35,
                y: this.position.y - 33,
            },
            imageSrc: './assets/guns/AR.png',
            scale: 1.5,
        })
        this.gun.currentDirection = this.currentDirection
    }

    switchSprite(name) {
        if (this.image === this.animations[name].image) return

        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameBuffer = this.animations[name].frameBuffer
        this.frameRate = this.animations[name].frameRate
    }

    handleHurt() {
        if (!this.isHurt) {
            this.isHurt = true
            this.hurtAnimationComplete = false // Mark hurt animation as not complete
            this.switchSprite('playerHurt')
        }
    }

    // Method to handle player taking damage
    takeDamage() {
        this.health--
        if (this.health <= 0) {
            console.log('Player dead!')
            gameOver() // Assuming gameOver function handles game over logic
        } else {
            console.log('Player hurt!')
            this.handleHurt()
        }
    }

    handleInput(keys) {
        if (!this.isHurt && this.hurtAnimationComplete) {
            // Only allow input handling if not hurt and animation is complete
            if (keys.d.pressed) {
                this.currentDirection = 'right'
                this.switchSprite('playerMove')
            } else if (keys.a.pressed) {
                this.currentDirection = 'left'
                this.switchSprite('playerMove')
            } else {
                this.switchSprite('playerIdle')
            }

            if (keys.w.pressed && this.canJump) {
                this.velocity.y = this.jumpSize
                this.canJump = false
            }

            if (keys.k.pressed && this.canFire) {
                this.fireProjectile()
            }

            this.gun.currentDirection = this.currentDirection
        }
    }

    updateGun() {
        const position =
            this.currentDirection === 'right'
                ? {
                      x: this.position.x - 30 + this.recoilOffset.x,
                      y: this.position.y - 35 + this.recoilOffset.y,
                  }
                : {
                      x: this.position.x - 68 + this.recoilOffset.x,
                      y: this.position.y - 35 + this.recoilOffset.y,
                  }

        this.gun.position.x = position.x
        this.gun.position.y = position.y

        this.gun.draw()
    }

    fireProjectile() {
        const velocity =
            this.currentDirection === 'right'
                ? { x: 15, y: 0 }
                : { x: -15, y: 0 }
        const position =
            this.currentDirection === 'right'
                ? { x: this.position.x + 50, y: this.position.y + 15 }
                : { x: this.position.x - 25, y: this.position.y + 15 }

        const projectile = new Projectile({
            position: position,
            velocity: velocity,
            imageSrc: './assets/projectile/tile000.png',
        })
        this.projectiles.push(projectile)

        this.canFire = false // Disable firing

        // Apply recoil effect
        this.recoilOffset = {
            x: this.currentDirection === 'right' ? -10 : 10,
            y: -5,
        }
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x - 20 + (this.width * this.scale) / 2,
                y: this.position.y + 18,
            },
            width: 55,
            height: 65,
        }
        if (this.currentDirection === 'left') {
            this.hitbox = {
                position: {
                    x: this.position.x - 35 + (this.width * this.scale) / 2,
                    y: this.position.y + 18,
                },
                width: 55,
                height: 65,
            }
        }
    }

    handleProjectile() {
        // Update projectiles
        this.projectiles.forEach((projectile, index) => {
            projectile.update()
            // Remove the projectile if it goes off screen
            if (
                projectile.position.x + this.hitbox.width < 0 ||
                projectile.position.x > canvas.width
            ) {
                this.projectiles.splice(index, 1)
            }
        })
    }

    handleGravity() {
        //stop at ground
        if (
            this.hitbox.position.y + this.hitbox.height + this.velocity.y <=
            canvas.height
        ) {
            this.velocity.y += this.gravity
            this.canJump = false
        } else {
            console.log('player fall')
            gameOver()
        }
    }

    handleVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const block = this.collisionBlocks[i]
            if (
                this.hitbox.position.x <= block.position.x + block.width &&
                this.hitbox.position.x + this.hitbox.width >=
                    block.position.x &&
                this.hitbox.position.y + this.hitbox.height <=
                    block.position.y &&
                this.hitbox.position.y + this.hitbox.height + this.velocity.y >=
                    block.position.y
            ) {
                this.velocity.y = 0
                this.canJump = true
                if (keys.s.pressed) {
                    player.position.y += 10
                    keys.s.pressed = false
                }
                break
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (
            this.image === this.animations.playerHurt.image &&
            this.currentFrame === this.animations.playerHurt.frameRate - 1
        ) {
            this.hurtAnimationComplete = true // Mark hurt animation as complete
            this.isHurt = false
        }

        this.draw()
        this.handleInput(keys)

        this.handleGravity()
        this.updateHitbox()
        this.handleVerticalCollisions()
        this.handleProjectile()
        this.updateGun()

        // ctx.fillStyle = 'rgba(0,0,255,0.5)'
        // ctx.fillRect(
        //     this.hitbox.position.x,
        //     this.hitbox.position.y,
        //     this.hitbox.width,
        //     this.hitbox.height
        // )
    }
}
