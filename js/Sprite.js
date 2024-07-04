class Sprite {
    constructor({
        position,
        imageSrc,
        frameRate = 1,
        frameBuffer = 1,
        scale = 1,
        animations,
        loop = true,
    }) {
        this.position = position

        this.image = new Image()
        this.image.src = imageSrc

        this.image.onload = () => {
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
        }

        this.scale = scale
        this.loop = loop

        this.frameRate = frameRate
        this.frameBuffer = frameBuffer

        this.currentFrame = 0
        this.elapsedFrame = 0

        this.animations = animations
        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }
        }
    }

    draw() {
        ctx.imageSmoothingEnabled = false
        const cropbox = {
            position: {
                x: this.width * this.currentFrame,
                y: 0,
            },
            width: this.width,
            height: this.height,
        }

        ctx.save()

        if (this.currentDirection === 'left') {
            ctx.scale(-1, 1)
            ctx.drawImage(
                this.image,
                cropbox.position.x,
                cropbox.position.y,
                cropbox.width,
                cropbox.height,
                -this.position.x - this.width * this.scale,
                this.position.y,
                this.width * this.scale,
                this.height * this.scale
            )
        } else {
            ctx.drawImage(
                this.image,
                cropbox.position.x,
                cropbox.position.y,
                cropbox.width,
                cropbox.height,
                this.position.x,
                this.position.y,
                this.width * this.scale,
                this.height * this.scale
            )
        }

        ctx.restore()

        this.updateFrame()
    }

    updateFrame() {
        this.elapsedFrame++

        if (this.elapsedFrame % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else if (this.loop) this.currentFrame = 0
        }
    }
}
