const { createApp } = Vue;

createApp({
    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            spiderX: window.innerWidth / 2,
            spiderY: window.innerHeight / 2,
            delayFactor: 0.03 // velocità del ragnetto
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
            const dx = this.mouseX - this.spiderX;
            const dy = this.mouseY - this.spiderY;

            this.spiderX += dx * this.delayFactor;
            this.spiderY += dy * this.delayFactor;

            document.getElementById('spider').style.transform = `translate(${this.spiderX}px, ${this.spiderY}px)`;
        }
    },
    mounted() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        const animateSpider = () => {
            this.updateSpiderPosition();
            document.body.style.backgroundColor = this.backgroundColor;
            requestAnimationFrame(animateSpider);
        };
        
        animateSpider();
    }
}).mount('#app');
