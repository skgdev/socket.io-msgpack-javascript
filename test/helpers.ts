import assert from 'node:assert';
import customParser from '../src/index';

const parser = customParser.build();
const encoder = new parser.Encoder();

const helpers = (object: any, done: () => void) => {
    const encodedPackets = encoder.encode(object);

    const decoder = new parser.Decoder();
    decoder.on('decoded', packet => {
        assert.deepEqual(packet, object);
        done();
    });

    decoder.add(encodedPackets[0]);
};

export default helpers;
