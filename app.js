const { createApp } = Vue;

createApp({
    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            sphereX: window.innerWidth / 2,
            sphereY: window.innerHeight / 2,
            delayFactor: 0.02
        };
    },
    methods: {
        updateSpherePosition() {
            const dx = this.mouseX - this.sphereX;
            const dy = this.mouseY - this.sphereY;

            this.sphereX += dx * this.delayFactor;
            this.sphereY += dy * this.delayFactor;

            document.getElementById('energy-sphere').style.transform = `translate(${this.sphereX}px, ${this.sphereY}px)`;

            this.createParticleTrail();
        },
        createParticleTrail() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${this.sphereX}px`;
            particle.style.top = `${this.sphereY}px`;
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    },
    mounted() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        const animateSphere = () => {
            this.updateSpherePosition();
            requestAnimationFrame(animateSphere);
        };

        animateSphere();
    }
}).mount('#app');
