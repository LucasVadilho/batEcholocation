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

// Controle da Simulação
let factor = 100;
let updateFreq = 1 * factor;    // s^⁻1
let dt = 0.005 / factor;        // s
let time = 0;

let vRel;
let targetSize;
let pulseDuration;
let pulseInterval;

let dscf;
let cf2;
let selected;

function setup() {
    createCanvas(550, 360);

    vRel = createSlider(-10, 10, 0, 0.01);
    vRelValue = createP();
    vRel.parent("vRel");
    vRelValue.parent("vRel");

    targetSize = createSlider(0, 1, 0.5, 0.01);
    targetSizeValue = createP();
    targetSize.parent("targetSize");
    targetSizeValue.parent("targetSize");

    pulseDuration = createSlider(0, 50, 10, 0.25);
    pulseDurationValue = createP();
    pulseDuration.parent("pulseDuration");
    pulseDurationValue.parent("pulseDuration");

    pulseInterval = createSlider(0, 100, 20, .25);
    pulseIntervalValue = createP();
    pulseInterval.parent("pulseInterval");
    pulseIntervalValue.parent("pulseInterval");

    createP("<i>1 segundo real é equivalente a " + updateFreq * dt * 1000 + " ms na simulação.</i>").parent("texto");
    createP("<i>A frequência <b>exibida</b> no gráfico do CF2 não é o valor da frequência simulada. É apenas uma ilustração que possibilita visualizar o impacto da Velocidade Relativa na frequência.</i>").parent("texto");

    dscf = new DSCF(500);
    cf2 = new CF2();

    dscf.neuronios[0].select();
    selected = dscf.neuronios[0];

    setInterval(() => {
        dscf.update();
        cf2.update();

        time += dt;
    }, 1000 / updateFreq);
}

function draw() {
    background(248, 248, 255);

    push();
    translate(width / 2, 250);
    dscf.draw();
    pop();

    cf2.draw();

    vRelValue.html(vRel.value().toFixed(2) + " m/s");
    targetSizeValue.html(targetSize.value().toFixed(2) + " (1: reflexo 100%)");
    pulseDurationValue.html(pulseDuration.value() + " ms");
    pulseIntervalValue.html(pulseInterval.value() + " ms");

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
