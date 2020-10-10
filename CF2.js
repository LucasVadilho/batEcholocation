class CF2 {
    static RESTING_FREQUENCY = 60.6;
    static SOUND_SPEED = 343;

    constructor() {
        this.freq = CF2.RESTING_FREQUENCY;
        this.amp = 1;

        this.wave = [];

        this.active = true;
        this.toggleActive();
    }

    toggleActive() {
        if (this.active) {
            this.active = false;
            setTimeout(this.toggleActive.bind(this), pulseInterval.value() / (updateFreq * dt));
        } else {
            this.active = true;
            setTimeout(this.toggleActive.bind(this), pulseDuration.value() / (updateFreq * dt));
        }
    }

    update() {
        this.freq = (1 + vRel.value() / CF2.SOUND_SPEED) * CF2.RESTING_FREQUENCY;
        this.amp = targetSize.value();

        if (this.active) this.wave.unshift(this.amp * Math.sin(2 * Math.PI * this.freq * 1000 * time));
        else this.wave.unshift(0);

        if (this.wave.length > width) this.wave.pop();
    }

    getParameters() {
        if (this.active) return { freq: this.freq, amp: this.amp }
        else return { freq: 0, amp: 0 }
    }

    draw() {
        let { freq, amp } = this.getParameters();

        textSize(24);
        noStroke();
        textAlign(CENTER, CENTER);
        text("CF2", 0, 5, 100, 30);
        textSize(16);
        text(freq.toFixed(3) + " kHz", 0, 35, 100, 35);
        text(amp * 100 + " %", 0, 35, 100, 100);

        push();

        translate(100, 50);
        strokeWeight(1);
        stroke(0);
        noFill();

        beginShape();
        for (let i = 0; i < width; i++) {
            vertex(i, 50 * this.wave[i]);
        }
        endShape();

        pop();
    }
}