export default class Deconstructor {
    private epoch: number;

    constructor(options: { epoch: number } = { epoch: Date.now() }) {
        this.epoch = options.epoch;
    }

    public deconstruct(snowflake: string) {
        let bin = '';
        let high = parseInt(snowflake.slice(0, -10)) || 0;
        let low = parseInt(snowflake.slice(-10));

        if (Number.isNaN(low)) {
            throw new Error('Invalid snowflake');
        }

        while (low > 0 || high > 0) {
            bin = String(low & 1) + bin;
            low = Math.floor(low / 2);

            if (high > 0) {
                low += 5000000000 * (high % 2);
                high = Math.floor(high / 2);
            }
        }

        const BINARY = bin.toString().padStart(64, '0');
        const timestamp = parseInt(BINARY.substring(0, 42), 2) + this.epoch;

        return new Date(timestamp);
    }
}
