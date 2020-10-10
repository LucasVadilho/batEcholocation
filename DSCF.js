class DSCF {
    constructor(nNeuronios = 100) {
        this.radius = 100;
        this.neuronios = [];
        this.populate(nNeuronios);
    }

    populate(nNeuronios) {
        for (let i = 0; i < nNeuronios; i++) {
            // https://mathworld.wolfram.com/DiskPointPicking.html
            let sqrtR = this.radius * Math.sqrt(random());
            let theta = random(2 * Math.PI);
            let pos = createVector(sqrtR * Math.cos(theta), sqrtR * Math.sin(theta));

            let bestFreq = map(pos.mag(), 0, this.radius, 60.6, 62.3);
            let bestAmp = map(pos.y, -this.radius, this.radius, 0, 1);

            this.neuronios.push(new Neuronio(pos, bestFreq, bestAmp));
        }
    }

    update() {
        this.neuronios.forEach((n) => {
            n.update(cf2.getParameters());
        });
    }

    draw() {
        noFill();
        strokeWeight(1);
        stroke(0);

        circle(0, 0, 2 * this.radius + Neuronio.radius);

        this.neuronios.forEach((n) => {
            n.draw();
        });
    }
}