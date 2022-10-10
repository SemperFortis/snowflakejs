export default class Generator {
    private config: {
        epoch: bigint;
        workerId: bigint;
        datacenterId: bigint;
        workerIdBits: bigint;
        datacenterIdBits: bigint;
        sequence: bigint;
        sequenceBits: bigint;
    };
    private sequence: bigint;
    private maxWorkerId: bigint;
    private maxDatacenterId: bigint;
    private workerIdShift: bigint;
    private datacenterIdShift: bigint;
    private timestampLeftShift: bigint;
    private sequenceMask: bigint;
    private lastTimestamp: bigint;

    constructor(
        setup: {
            epoch: number;
            workerId?: number;
            datacenterId?: number;
            workerIdBits?: number;
            datacenterIdBits?: number;
            sequence?: number;
            sequenceBits?: number;
        } = {
            epoch: Date.now(),
        },
    ) {
        this.config = {
            epoch: this.hydrate(setup.epoch, 1577836800000n),
            workerId: this.hydrate(setup.workerId ?? 0, 0n),
            datacenterId: this.hydrate(setup.datacenterId ?? 0, 0n),
            workerIdBits: this.hydrate(setup.workerIdBits ?? 5, 0n),
            datacenterIdBits: this.hydrate(setup.datacenterIdBits ?? 5, 0n),
            sequence: this.hydrate(setup.sequence ?? 0, 0n),
            sequenceBits: this.hydrate(setup.sequenceBits ?? 12, 0n),
        };
        this.sequence = this.config.sequence;
        this.maxWorkerId = -1n ^ (-1n << this.config.workerIdBits);
        this.maxDatacenterId = -1n ^ (-1n << this.config.datacenterIdBits);
        this.workerIdShift = this.config.sequenceBits;
        this.datacenterIdShift =
            this.config.sequenceBits + this.config.workerIdBits;
        this.timestampLeftShift =
            this.config.sequenceBits +
            this.config.workerIdBits +
            this.config.datacenterIdBits;
        this.sequenceMask = -1n ^ (-1n << this.config.sequenceBits);
        this.lastTimestamp = -1n;

        this.validate();
    }

    private hydrate(value: any, defaultValue: bigint) {
        if (typeof value === 'bigint') {
            return value;
        } else if (typeof value === 'number') {
            return BigInt(value);
        } else {
            console.error(
                `Setup values must be a number or a BigInt, defaulting to ${defaultValue}`,
            );

            return defaultValue;
        }
    }

    private validate() {
        if (
            this.config.workerId > this.maxWorkerId ||
            this.config.workerId < 0
        ) {
            throw new Error(
                `Worker ID cannot be greater than ${this.maxWorkerId} or less than 0`,
            );
        }
        
        if (
            this.config.datacenterId > this.maxDatacenterId ||
            this.config.datacenterId < 0
        ) {
            throw new Error(
                `Datacenter ID cannot be greater than ${this.maxDatacenterId} or less than 0`,
            );
        }
    }

    private tilNextMillis(lastTimestamp: bigint) {
        let timestamp = this.timeGen();

        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }

        return timestamp;
    }

    private timeGen() {
        return BigInt(Date.now());
    }

    public generate() {
        let timestamp = this.timeGen();

        if (timestamp < this.lastTimestamp) {
            throw new Error(
                `Clock moved backwards. Refusing to generate ID for ${
                    this.lastTimestamp - timestamp
                } milliseconds`,
            );
        }

        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;

            if (this.sequence === 0n) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        return (
            ((timestamp - this.config.epoch) << this.timestampLeftShift) |
            (this.config.datacenterId << this.datacenterIdShift) |
            (this.config.workerId << this.workerIdShift) |
            this.sequence
        ).toString();
    }
}
