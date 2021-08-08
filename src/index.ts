import Generator from './generator';
import Deconstructor from './deconstructor';

export default {
    generate: (
        options: {
            epoch: number;
            workerId?: number;
            datacenterId?: number;
            workerIdBits?: number;
            datacenterIdBits?: number;
            sequence?: number;
            sequenceBits?: number;
        } = { epoch: Date.now() },
    ) => {
        const generator = new Generator(options);

        return generator.generate();
    },
    deconstruct: (
        id: string,
        options: { epoch: number } = { epoch: Date.now() },
    ) => {
        const deconstructor = new Deconstructor(options);

        return deconstructor.deconstruct(id);
    },
};
