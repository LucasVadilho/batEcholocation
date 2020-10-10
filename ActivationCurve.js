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
        
        plot.meta.xAxis.ticks(6);
        plot.meta.xAxis.tickFormat((t) => t.toFixed(2));
        plot.meta.yAxis.tickFormat((t) => t.toFixed(2));
        plot.draw();
    }
}