const { createApp } = Vue;

createApp({
    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            sphereX: window.innerWidth / 2,
            sphereY: window.innerHeight / 2,
            delayFactor: 0.1,
            score: 0,
            timeLeft: 60,
            target: null
        };
    },
    methods: {
        updateSpherePosition() {
            const dx = this.mouseX - this.sphereX;
            const dy = this.mouseY - this.sphereY;

            this.sphereX += dx * this.delayFactor;
            this.sphereY += dy * this.delayFactor;

            document.getElementById('energy-sphere').style.transform = `translate(${this.sphereX}px, ${this.sphereY}px)`;

            this.checkCollision();
        },
        createTarget() {
            if (this.target) {
                this.target.remove();
            }
            this.target = document.createElement('div');
            this.target.className = 'target';
            this.target.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
            this.target.style.top = `${Math.random() * (window.innerHeight - 40)}px`;
            document.getElementById('app').appendChild(this.target);
        },
        checkCollision() {
            const targetRect = this.target.getBoundingClientRect();
            const sphereRect = document.getElementById('energy-sphere').getBoundingClientRect();
            const isColliding = !(
                sphereRect.right < targetRect.left ||
                sphereRect.left > targetRect.right ||
                sphereRect.bottom < targetRect.top ||
                sphereRect.top > targetRect.bottom
            );
            if (isColliding) {
                this.score += 1;
                document.getElementById('score').textContent = `Punti: ${this.score}`;
                this.createTarget();
                this.playSound();
            }
        },
        startTimer() {
            const timerInterval = setInterval(() => {
                this.timeLeft -= 1;
                document.getElementById('timer').textContent = `Tempo: ${this.timeLeft}s`;
                if (this.timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert(`Tempo scaduto! Punti totali: ${this.score}`);
                    this.resetGame();
                }
            }, 1000);
        },
        resetGame() {
            this.score = 0;
            this.timeLeft = 60;
            document.getElementById('score').textContent = `Punti: 0`;
            document.getElementById('timer').textContent = `Tempo: 60s`;
            this.createTarget();
            this.startTimer();
        },
        playSound() {
            const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
            audio.play();
        }
    },
    mounted() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        this.createTarget();
        this.startTimer();

        const animateSphere = () => {
            this.updateSpherePosition();
            requestAnimationFrame(animateSphere);
        };

        animateSphere();
    }
}).mount('#app');
