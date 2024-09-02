const { createApp } = Vue;

createApp({
    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            spiderX: window.innerWidth / 2,
            spiderY: window.innerHeight / 2,
            delayFactor: 0.008,
            isClose: false,
            scared: false
        };
    },
    computed: {
        distance() {
            const dx = this.mouseX - this.spiderX;
            const dy = this.mouseY - this.spiderY;
            return Math.sqrt(dx * dx + dy * dy);
        },
        backgroundColor() {
            const proximity = Math.min(this.distance / 300, 1);
            const red = Math.floor(255 * proximity);
            const green = Math.floor(255 * (1 - proximity));
            return `rgb(${red},${green},0)`;
        }
    },
    methods: {
        updateSpiderPosition() {
            if (this.scared) return; // Il ragnetto non si muove se è spaventato
            
            const dx = this.mouseX - this.spiderX;
            const dy = this.mouseY - this.spiderY;

            this.spiderX += dx * this.delayFactor;
            this.spiderY += dy * this.delayFactor;

            document.getElementById('spider').style.transform = `translate(${this.spiderX}px, ${this.spiderY}px)`;

            this.updateEyes(dx, dy);

            if (this.distance < 100) {
                this.isClose = true;
                document.getElementById('spider').classList.add('tremble');
                this.changeSpiderColor();
            } else {
                this.isClose = false;
                document.getElementById('spider').classList.remove('tremble');
                this.resetSpiderColor();
            }

            this.createParticleTrail();
        },
        updateEyes(dx, dy) {
            const angle = Math.atan2(dy, dx);
            const eyeMovement = 5;
            const leftEye = document.querySelector('.eye.left .pupil');
            const rightEye = document.querySelector('.eye.right .pupil');

            leftEye.style.transform = `translate(${Math.cos(angle) * eyeMovement}px, ${Math.sin(angle) * eyeMovement}px)`;
            rightEye.style.transform = `translate(${Math.cos(angle) * eyeMovement}px, ${Math.sin(angle) * eyeMovement}px)`;
        },
        changeSpiderColor() {
            document.querySelector('.body').style.backgroundColor = '#ff595e';
        },
        resetSpiderColor() {
            document.querySelector('.body').style.backgroundColor = 'black';
        },
        createParticleTrail() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${this.spiderX + 20}px`;
            particle.style.top = `${this.spiderY + 20}px`;
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        },
        scareSpider() {
            this.scared = true;
            const scareDistance = 150;
            const angle = Math.atan2(this.mouseY - this.spiderY, this.mouseX - this.spiderX);
            this.spiderX -= Math.cos(angle) * scareDistance;
            this.spiderY -= Math.sin(angle) * scareDistance;
            setTimeout(() => this.scared = false, 500);
        }
    },
    mounted() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        window.addEventListener('click', () => {
            this.scareSpider();
        });

        const animateSpider = () => {
            this.updateSpiderPosition();
            document.body.style.backgroundColor = this.backgroundColor;
            requestAnimationFrame(animateSpider);
        };

        animateSpider();
    }
}).mount('#app');
