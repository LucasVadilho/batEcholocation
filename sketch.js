/*
By far the largest of the specialized
regions in the mustached bat's auditory cortex is the one that processes
Doppler-shifted CF 2 signals. This region, called the DSCF area, represents
only a narrow sliver of the frequency range, between 60.6 and 62.3 kilohertz 
(when the bat's resting frequency is 61.00 kilohertz). Yet it occupies
30 percent of the primary auditory
cortex. The exact frequencies overrepresented differ among individual bats
according to their resting frequencies.
In other words, each bat's auditory
system is personalized. 

Neurons in the DSCF area are sharply tuned to particular frequencies,
even more so than neurons in the auditory periphery. They are also tuned
to the amplitude of a signal. Hence,
each DSCF neuron has a particular
frequency and amplitude to which it
responds best. This sharpening of the
response is apparently the result of
lateral inhibition, a ubiquitous mechanism in sensory systems by which
inhibitory signals from adjacent neurons enhance the selectivity of 
a neuron to a particular stimulus.

What is the function of the DSCF
area? Neurons in the area respond
purely to the amplitude and frequency of the echo CF2 , regardless of the
frequency of the emitted pulse. DSCF
neurons, then, presumably are related
to the acuity of frequency and amplitude discrimination, as well as to the
detection of changes in frequency and
amplitude that would be evoked by
flying insects.

According to recent experiments by
Stephen J. Gaioni, Hiroshi Rikimaru
and me, if the DSCF area is destroyed,
a bat can no longer discriminate tiny
differences in frequency-only large
ones. The animal requires twice as
much time to carry out Doppler-shift
compensation and performs the task
only half as well. From this we speculate that the DSCF area is
 responsible for the precision of the Dopplershift compensation but
  not for performing the actual compensation. We
do not know yet how the DSCF area
is connected to other regions that are
responsible for executing Dopplershift compensation.
*/

// slider tamanho presa => ampl
// slider vRel => segundo harmonico freq diferente

class ActivationCurve {
    constructor(mean, specificity, target, xDomain, xTitle, yTitle = "Intensidade") {
        this.target = target;
        this.xDomain = xDomain;
        this.xTitle = xTitle;
        this.yTitle = yTitle;

        this.mean = mean;
        this.sd = random(0.5);

        this.threshold = specificity * this.fActivation(mean - 1 * this.sd);
        this.max = this.fActivation(mean);
    }

    fActivation(x) {
        return 1 / (this.sd * Math.sqrt(2 * Math.PI)) * Math.pow(Math.E, -0.5 * ((x - this.mean) / this.sd) ** 2);
    }

    plot() {
        let plot = functionPlot({
            target: this.target,
            width: 250,
            height: 200,
            yAxis: {
                domain: [0, this.max + .1 * this.max],
                label: this.yTitle
            },
            xAxis: {
                domain: this.xDomain,
                label: this.xTitle
            },
            data: [
                {
                    fn: 'a * 2.718 ^ (-0.5 * ((x - mu) / sigma) ^ 2)',
                    sampler: 'builtIn',
                    graphType: 'polyline',
                    scope: {
                        sigma: this.sd,
                        mu: this.mean,
                        a: 1 / (this.sd * Math.sqrt(2 * Math.PI))
                    }
                }
            ],
            annotations: [
                { x: this.mean, text: "Melhor Resposta" },
                { y: this.threshold, text: "Threshold" }
            ]
        });
        console.log(plot.meta);
        plot.meta.xAxis.ticks(6);
        plot.meta.xAxis.tickFormat((t) => t.toFixed(2));
        plot.meta.yAxis.tickFormat((t) => t.toFixed(2));
        plot.draw();
    }
}

class Neuronio {
    static radius = 10;

    // Estados
    static ESTADOS = {
        RESTING: {
            nome: "Resting",
            duracao: -1,
            cor: [0, 200, 120, 100]
        },
        FIRING: {
            nome: "Firing",
            duracao: 1000,
            cor: [255, 0, 0, 100]
        },
        REFRACTORY: {
            nome: "Refractory",
            duracao: 500,
            cor: [0, 0, 255, 100]
        }
    };

    constructor(pos, bestFreq, bestAmp) {
        this.estado = Neuronio.ESTADOS.RESTING;
        this.pos = pos;
        this.freq = new ActivationCurve(bestFreq, 1, "#freqPlot", [58, 63], "Frequencia (kHz)");
        this.amp = new ActivationCurve(bestAmp, 1, "#ampPlot", [-2, 2], "Amplitude (dB)");
    }

    update(input) {
        // Processamento
        let freqResp = this.freq.fActivation(input.freq) > this.freq.threshold;
        let ampResp = this.amp.fActivation(input.amp) > this.amp.threshold;

        // Estado
        if (this.estado === Neuronio.ESTADOS.RESTING && freqResp && ampResp) {
            this.estado = Neuronio.ESTADOS.FIRING;
            setTimeout(() => this.estado = Neuronio.ESTADOS.REFRACTORY, Neuronio.ESTADOS.FIRING.duracao);
            setTimeout(() => this.estado = Neuronio.ESTADOS.RESTING, Neuronio.ESTADOS.FIRING.duracao + Neuronio.ESTADOS.REFRACTORY.duracao);
        }
    }

    mousePressed() {
        if (dist(mouseX - width / 2, mouseY - 250, this.pos.x, -this.pos.y) < Neuronio.radius) {
            this.select();
            return true;
        }
    }

    select() {
        this.selected = true;

        this.freq.plot();
        this.amp.plot();
    }

    unselect() {
        this.selected = false;
    }

    draw() {
        noFill();

        if (this.selected) {
            stroke(0, 0, 255);
            strokeWeight(2);
        }
        else {
            stroke(33, 100);
            strokeWeight(1);
        }

        fill(this.estado.cor);


        circle(this.pos.x, -this.pos.y, Neuronio.radius);
    }
}

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
        // console.log(cf2.getParameters());
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
            setTimeout(this.toggleActive.bind(this), pulseInterval.value());
        } else {
            this.active = true;
            setTimeout(this.toggleActive.bind(this), pulseDuration.value());
        }
    }

    update() {
        this.freq = (1 + vRel.value() / CF2.SOUND_SPEED) * CF2.RESTING_FREQUENCY;
        this.amp = targetSize.value();

        if (this.active) this.wave.unshift(this.amp * Math.sin(2 * Math.PI * this.freq * time));
        else this.wave.unshift(0);

        if (this.wave.length > width) this.wave.pop();
    }

    getParameters() {
        if (this.active) return { freq: this.freq, amp: this.amp }
        else return { freq: 0, amp: 0 }
    }

    draw() {
        textSize(24);
        noStroke();
        textAlign(CENTER, CENTER);
        text("CF2", 0, 5, 100, 30);
        textSize(16);
        let { freq, amp } = this.getParameters();
        text(freq.toFixed(3) + " kHz", 0, 35, 100, 35);
        text(amp.toFixed(3) * 100 + " %", 0, 35, 100, 100);


        strokeWeight(1);
        stroke(0);
        push();
        translate(100, 50);

        beginShape();
        noFill();
        for (let i = 0; i < width; i++) {
            vertex(i, 50 * this.wave[i]);
        }
        endShape();

        pop();
    }
}

// sliders
let vRel;
let targetSize;
let pulseDuration;
let pulseInterval;

let time;
let dscf;
let cf2;
let selected;

function setup() {
    createCanvas(550, 360);

    vRel = createSlider(-10, 10, 0, 0.01);
    vRelValue = createP(vRel.value() + " m/s");
    vRel.parent("vRel");
    vRelValue.parent("vRel");

    targetSize = createSlider(0, 1, 0.5, 0.01);
    targetSizeValue = createP(targetSize.value() + " (1: reflexo 100%)");
    targetSize.parent("targetSize");
    targetSizeValue.parent("targetSize");

    pulseDuration = createSlider(0, 5000, 1000, 100);
    pulseDurationValue = createP(pulseDuration.value() + " ms reais");
    pulseDuration.parent("pulseDuration");
    pulseDurationValue.parent("pulseDuration");

    pulseInterval = createSlider(0, 5000, 2000, 100);
    pulseIntervalValue = createP(pulseInterval.value() + " ms reais");
    pulseInterval.parent("pulseInterval");
    pulseIntervalValue.parent("pulseInterval");

    time = 0;
    dscf = new DSCF(500);
    cf2 = new CF2();

    dscf.neuronios[0].select();
    selected = dscf.neuronios[0];
}

function draw() {
    background(248, 248, 255);

    push();
    translate(width / 2, 250);

    dscf.update();
    dscf.draw();
    pop();

    cf2.update();
    cf2.draw();

    vRelValue.html(vRel.value().toFixed(2) + " m/s");
    targetSizeValue.html(targetSize.value().toFixed(2) + " (1: reflexo 100%)");
    pulseDurationValue.html(pulseDuration.value() + " ms reais");
    pulseIntervalValue.html(pulseInterval.value() + " ms reais");

    push();
    translate(width - 100, 0);
    let i = 0;
    for (let [key, estado] of Object.entries(Neuronio.ESTADOS)) {
        stroke(0);
        fill(estado.cor);
        circle(0, 150 + i * 50, Neuronio.radius);
        textSize(14);
        
        noStroke();
        fill(0);
        textAlign(LEFT, TOP);
        text(estado.nome, Neuronio.radius, 150 - Neuronio.radius / 2 + i * 50, 100, 14);

        i++;
    }
    pop();

    time += 0.1;
}

function mousePressed() {
    for (let i = dscf.neuronios.length - 1; i >= 0; i--) {
        if (dscf.neuronios[i].mousePressed()) {
            if (dscf.neuronios[i] != selected) selected.unselect();

            selected = dscf.neuronios[i];
            return;
        }
    }
}
