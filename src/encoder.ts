import msgpack from '@msgpack/msgpack';

const buildEncoder = (options: msgpack.EncodeOptions = {}) => class Encoder {
    options;

    constructor() {
        this.options = options;
    }

    encode(packet: unknown) {
        const encoded = msgpack.encode(packet, this.options);
        const buffer = new Uint8Array(encoded);

        return [buffer];
    }
};

export default buildEncoder;
