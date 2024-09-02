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
            target: null,
            enemies: [],
            enemySpeed: 0.05,
            timerTickSound: new Audio('https://www.soundjay.com/button/beep-07.wav'),
            timeUpSound: new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'),
            hitSound: new Audio('https://www.soundjay.com/button/beep-10.wav'),
            gameOver: false
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
            this.updateEnemies();
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
        createEnemy() {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            enemy.style.left = `${Math.random() * window.innerWidth}px`;
            enemy.style.top = `${Math.random() * window.innerHeight}px`;
            document.getElementById('app').appendChild(enemy);
            this.enemies.push(enemy);
        },
        updateEnemies() {
            if (this.gameOver) return;
            this.enemies.forEach((enemy, index) => {
                const dx = this.sphereX - parseFloat(enemy.style.left);
                const dy = this.sphereY - parseFloat(enemy.style.top);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const movementX = (dx / distance) * this.enemySpeed * 100;
                const movementY = (dy / distance) * this.enemySpeed * 100;

                enemy.style.transform = `translate(${movementX}px, ${movementY}px)`;

                if (distance < 40) {
                    this.endGame();
                }
            });
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
                this.playSound(this.hitSound);
            }
        },
        startTimer() {
            const timerInterval = setInterval(() => {
                if (this.gameOver) {
                    clearInterval(timerInterval);
                    return;
                }
                this.timeLeft -= 1;
                document.getElementById('timer').textContent = `Tempo: ${this.timeLeft}s`;
                this.playSound(this.timerTickSound);
                if (this.timeLeft <= 0) {
                    clearInterval(timerInterval);
                    this.playSound(this.timeUpSound);
                    alert(`Tempo scaduto! Punti totali: ${this.score}`);
                    this.resetGame();
                } else if (this.timeLeft % 10 === 0) {
                    this.createEnemy();
                }
            }, 1000);
        },
        resetGame() {
            this.score = 0;
            this.timeLeft = 60;
            this.enemySpeed = 0.05;
            this.enemies.forEach(enemy => enemy.remove());
            this.enemies = [];
            document.getElementById('score').textContent = `Punti: 0`;
            document.getElementById('timer').textContent = `Tempo: 60s`;
            this.createTarget();
            this.startTimer();
            this.gameOver = false;
        },
        playSound(sound) {
            sound.play();
        },
        endGame() {
            this.gameOver = true;
            alert(`Sei stato preso! Punti totali: ${this.score}`);
            this.resetGame();
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
            if (!this.gameOver) {
                this.updateSpherePosition();
            }
            requestAnimationFrame(animateSphere);
        };

        animateSphere();
    }
}).mount('#app');
