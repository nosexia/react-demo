import React, { useRef, FC, useEffect } from 'react';
const colours = [
    '#2185C5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF7F66'];
const limit = 50;
function randomColour() {
    return colours[randomIntFromRange(0, colours.length)];
}
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const Particle: FC = () => {
    const canvas = useRef<any>(null)
    let c = null
    let particles = [];
    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };

    useEffect(() => {
        c = canvas.current.getContext('2d');
        let parent = canvas.current.parentNode;
        
        // Event listeners
        window.addEventListener('mousemove', function (event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        window.addEventListener('resize', setCanvasDimensions);

        window.addEventListener('click', function () {
            // explode?
        });

        initCanvas()
    }, [])


    function setCanvasDimensions() {
        if (canvas && canvas.current) {
            canvas.current.height = window.innerHeight;
            canvas.current.width = window.innerWidth;
        }
    }



    function animate() {
        requestAnimationFrame(animate);
        c.fillStyle = 'rgba(240, 242, 245, 0.2)';
        c.fillRect(0, 0, canvas.current.width, canvas.current.height);
        particles.forEach(particle => {
            particle.update();
        });
    }

    function initCanvas() {
        setCanvasDimensions();
        particles = [];
        for (let i = 0; i < limit; i++) {
            const particle = new ParticleItem({
                x: canvas.current.width / 2,
                y: canvas.current.height / 2,
                radius: Math.random() * 2 + 1,
                c,
                mouse,
            });

            particles.push(particle);
        }

        animate();
    }

    function ParticleItem({ x, y, velocity, radius, colour } = {}) {
        this.x = x;
        this.y = y;
        this.velocity = velocity || 0.05;
        this.radius = radius;
        this.colour = randomColour();
        this.radians = Math.random() * Math.PI * 2;
        this.distanceFromCenter = randomIntFromRange(50, 120);
        this.lastMouse = { x: x, y: y };

        this.update = () => {
            const lastPoint = {
                x: this.x,
                y: this.y
            };

            // Move points over time
            this.radians += this.velocity;

            // Drag effect
            this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
            this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

            // Circular motion
            this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
            this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
            this.draw(lastPoint);
        };

        this.draw = lastPoint => {
            c.beginPath();
            c.strokeStyle = this.colour;
            c.lineWidth = this.radius;
            c.moveTo(lastPoint.x, lastPoint.y);
            c.lineTo(this.x, this.y);
            c.stroke();
            c.closePath();
        };
    }


    return <canvas style={{ position: 'absolute', top: 0, left: 0,backgroundColor: 'transparent'}} ref={canvas}></canvas>
}

export default Particle;