
/* Purpose:
 * This file is to handle rolling values.
 */

class Rolling {
    constructor(tau = 60) {
        this.tau = tau;
        this.data = [];

        this._resetState();
    }

    add(entry) {
        const { ts, value } = entry;

        this._cleanData(ts - this.tau);

        this.data.push(entry);

        this._computeState(entry);

        const state = this.state;
        state.time = ts;
        state.value = value;
        state.nb = this.data.length;
    }

    getState() {
        return this.state;
    }

    _resetState() {
        this.state = {
            time: 0,
            value: 0,
            nb: 0,
            sum: 0,
            min: Infinity,
            max: -Infinity,
        };
    }

    _computeState(entry) {
        const value = entry.value;
        const state = this.state;

        state.sum += value;
        state.min = Math.min(state.min, value);
        state.max = Math.max(state.max, value);
    }

    _cleanData(threshold) {
        const firstEntry = this.data[0];

        /* clean data only if it is needed */
        if (firstEntry && firstEntry.ts < threshold) {
            let splitIndex = 0;
            const length = this.data.length;

            this._resetState();

            /* index start at 1 as the first is already out of window */
            for (let index = 1; index < length; index++) {
                const entry = this.data[index];

                if (entry.ts < threshold) {
                    splitIndex = index;
                } else {
                    this._computeState(entry);
                }
            }

            this.data = this.data.slice(splitIndex + 1);
        }
    }
};

module.exports = Rolling;
