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
            duracao: 2 / (updateFreq * dt),
            cor: [255, 0, 0, 100]
        },
        REFRACTORY: {
            nome: "Refractory",
            duracao: 1 / (updateFreq * dt),
            cor: [0, 0, 255, 100]
        }
    };

    constructor(pos, bestFreq, bestAmp) {
        this.estado = Neuronio.ESTADOS.RESTING;
        this.pos = pos;
        this.freq = new ActivationCurve(bestFreq, 1, "#freqPlot", [58, 63], "Frequencia (kHz)");
        this.amp = new ActivationCurve(bestAmp, 1, "#ampPlot", [-.5, 1.5], "Amplitude (dB)");
    }

    update(input) {
        if (this.estado === Neuronio.ESTADOS.RESTING) {
            // Processamento
            let freqResp = this.freq.fActivation(input.freq) > this.freq.threshold;
            let ampResp = this.amp.fActivation(input.amp) > this.amp.threshold;

            // Estado
            if (freqResp && ampResp) {
                this.estado = Neuronio.ESTADOS.FIRING;
                setTimeout(() => this.estado = Neuronio.ESTADOS.REFRACTORY, Neuronio.ESTADOS.FIRING.duracao);
                setTimeout(() => this.estado = Neuronio.ESTADOS.RESTING, Neuronio.ESTADOS.FIRING.duracao + Neuronio.ESTADOS.REFRACTORY.duracao);
            }
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