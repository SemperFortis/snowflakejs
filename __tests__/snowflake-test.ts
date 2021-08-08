jest.dontMock('../src/index.ts');

import snowflake from '../src/index';

describe('constructs', () => {
    it('a snowflake id', () => {
        const id = snowflake.generate({
            epoch: 1577836800000,
            workerId: 0,
            datacenterId: 0,
            workerIdBits: 5,
            datacenterIdBits: 5,
            sequence: 0,
            sequenceBits: 12,
        });

        expect(id).toBeTruthy();
    });
});

describe('deconstructs', () => {
    it('an id and returns the date', () => {
        const date = snowflake.deconstruct('212316616883437568', {
            epoch: 1577836800000,
        });

        expect(date).toEqual(new Date('2021-08-08T21:10:26.117Z'));
    });
});
