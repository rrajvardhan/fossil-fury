class Projectile extends Sprite {
    constructor({
        position,
        velocity,
        imageSrc,
        frameRate = 1,
        frameBuffer = 1,
        scale = 1,
        loop,
    }) {
        super({ position, imageSrc, frameRate, frameBuffer, scale, loop })
        this.velocity = velocity

        this.hitbox = {
            position: {
                x: this.position.x + 25,
                y: this.position.y +35,
            },
            width: 20,
            height: 15,
        }
    }

    update() {
        this.position.x += this.velocity.x

        this.updateHitbox()
        this.draw()

        
        // ctx.fillStyle = 'rgba(0,0,255,0.5)'
        // ctx.fillRect(
        //     this.hitbox.position.x,
        //     this.hitbox.position.y,
        //     this.hitbox.width,
        //     this.hitbox.height
        // )
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 25,
                y: this.position.y +35,
            },
            width: 20,
            height: 15,
        }
    }
}
