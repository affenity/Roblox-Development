const EPSILON = 0.0001;
const exp = math.exp;
const cos = math.cos;
const sin = math.sin;
const sqrt = math.sqrt;

class Spring {
    public p: number | Vector3;
    public v: number | Vector3;
    public readonly target: number | Vector3;
    public readonly angularFrequency: number;
    public readonly dampingRatio: number;
    constructor(p0: number | Vector3, v0: number | Vector3, target: number | Vector3, angularFrequency: number, dampingRatio: number) {
        this.p = p0;
        this.v = v0;
        this.target = target;
        this.angularFrequency = angularFrequency;
        this.dampingRatio = dampingRatio;
    }

    update (dt: number) {
        const aF = this.angularFrequency;
        const dR = this.dampingRatio < 0 ? 0 : this.dampingRatio;

        if (aF < EPSILON) return;

        const epos = this.target;
        // @ts-ignore
        const dpos = this.p - epos;
        const dvel = this.v;

        if (dR > 1 + EPSILON) {
            const za = -aF * dR;
            const zb = aF * sqrt(dR * dR - 1);
            const z1 = za -zb;
            const z2 = za + zb;
            const expTerm1 = exp(z1 * dt);
            const expTerm2 = exp(z2 * dt);


            // @ts-ignore
            const c1 = (dvel - dpos * z2) / (-2 * zb);
            const c2 = dpos - c1;
            // @ts-ignore
            this.p = epos + c1 * expTerm1 + c2 * expTerm2;
            this.v = c1 * z1 * expTerm1 + c2 * z2 * expTerm2;
        } else if (dR > 1 - EPSILON) {
            const expTerm = exp(-aF * dt);
            // @ts-ignore
            const c1 = dvel + aF * dpos;
            const c2 = dpos;
            const c3 = (c1 * dt + c2) * expTerm;

            // @ts-ignore
            this.p = epos + c3;
            this.v = (c1 * expTerm) - (c3 * aF);
        } else {
            const omegaZeta = aF * dR;
            const alpha = aF * sqrt(1 - dR * dR);
            const expTerm = exp(-omegaZeta * dt);
            const cosTerm = cos(alpha * dt);
            const sinTerm = sin(alpha * dt);
            const c1 = dpos;
            // @ts-ignore
            const c2 = (dvel + omegaZeta * dpos) / alpha;

            // @ts-ignore
            this.p = epos + expTerm * (c1 * cosTerm + c2 * sinTerm);
            this.v = -expTerm * ((c1 * omegaZeta - c2 * alpha) * cosTerm + (c1 * alpha + c2 * omegaZeta) * sinTerm);
        }
    }
}

export default Spring;
