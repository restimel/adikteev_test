const { expect } = require('chai');
const Rolling = require('../modules/Rolling');

describe('Rolling()', () => {
    describe('when creating a new instance', () => {
        it('should have public methods', () => {
            const rolling = new Rolling();

            expect(typeof rolling.add).to.equal('function');
            expect(typeof rolling.getState).to.equal('function');
        });

        it('should change its TAU value', () => {
            const rolling1 = new Rolling();
            const rolling2 = new Rolling(120);

            expect(rolling1.tau).to.equal(60);
            expect(rolling2.tau).to.equal(120);
        });
    });

    describe('add()', () => {
        it('should add the new entry', () => {
            const rolling = new Rolling();

            rolling.add({
                ts: 100,
                value: 10,
            });

            expect(rolling.data.length).to.equal(1);

            rolling.add({
                ts: 120,
                value: 15,
            });

            expect(rolling.data.length).to.equal(2);
        });

        it('should remove too old entries', () => {
            const rolling = new Rolling();

            rolling.add({
                ts: 100,
                value: 10,
            });
            rolling.add({
                ts: 120,
                value: 10,
            });
            rolling.add({
                ts: 150,
                value: 10,
            });
            rolling.add({
                ts: 155,
                value: 10,
            });

            rolling.add({
                ts: 190,
                value: 10,
            });

            expect(rolling.data.length).to.equal(3);

            rolling.add({
                ts: 300,
                value: 10,
            });

            expect(rolling.data.length).to.equal(1);
        });

        it('should behave regarding TAU', () => {
            const rolling = new Rolling(100);

            rolling.add({
                ts: 100,
                value: 10,
            });
            rolling.add({
                ts: 120,
                value: 10,
            });
            rolling.add({
                ts: 150,
                value: 10,
            });
            rolling.add({
                ts: 155,
                value: 10,
            });
            rolling.add({
                ts: 190,
                value: 10,
            });

            expect(rolling.data.length).to.equal(5);

            rolling.add({
                ts: 256,
                value: 10,
            });

            expect(rolling.data.length).to.equal(2);
        });

        it('should remove entry old of exactly TAU', () => {
            const rolling = new Rolling();

            rolling.add({
                ts: 100,
                value: 10,
            });

            rolling.add({
                ts: 200,
                value: 10,
            });

            expect(rolling.data.length).to.equal(1);
        });
    });

    describe('getState()', () => {
        it('should return empty state', () => {
            const rolling = new Rolling();

            const result = rolling.getState();

            expect(result).to.deep.equal({
                time: 0,
                value: 0,
                nb: 0,
                sum: 0,
                min: Infinity,
                max: -Infinity,
            });
        });

        it('should return state', () => {
            const rolling = new Rolling();
            rolling.add({
                ts: 100,
                value: 10,
            });
            rolling.add({
                ts: 110,
                value: 20,
            });
            rolling.add({
                ts: 120,
                value: 12,
            });

            const result = rolling.getState();

            expect(result).to.deep.equal({
                time: 120,
                value: 12,
                nb: 3,
                sum: 42,
                min: 10,
                max: 20,
            });
        });
    });
});
