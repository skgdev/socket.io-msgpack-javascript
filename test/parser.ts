import assert from 'node:assert';
import { PacketType } from '../src/packet-format';
import buildEncoder from '../src/encoder';
import buildDecoder from '../src/decoder';
import helpers from './helpers.js';

const Encoder = buildEncoder(); // eslint-disable-line @typescript-eslint/naming-convention
const Decoder = buildDecoder(); // eslint-disable-line @typescript-eslint/naming-convention

describe('parser', () => {
    it('exposes types', () => {
        assert.equal(typeof PacketType.CONNECT, 'number');
        assert.equal(typeof PacketType.DISCONNECT, 'number');
        assert.equal(typeof PacketType.EVENT, 'number');
        assert.equal(typeof PacketType.ACK, 'number');
        assert.equal(typeof PacketType.CONNECT_ERROR, 'number');
    });

    it('encodes connection', done => {
        helpers(
            {
                type: PacketType.CONNECT,
                nsp: '/woot',
                data: {
                    token: '123',
                },
            },
            done,
        );
    });

    it('encodes disconnection', done => {
        helpers(
            {
                type: PacketType.DISCONNECT,
                nsp: '/woot',
            },
            done,
        );
    });

    it('encodes an event', done => {
        helpers(
            {
                type: PacketType.EVENT,
                data: ['a', 1, {}],
                nsp: '/',
            },
            done,
        );
    });

    it('encodes an event (with an integer as event name)', done => {
        helpers(
            {
                type: PacketType.EVENT,
                data: [1, 'a', {}],
                nsp: '/',
            },
            done,
        );
    });

    it('encodes an event (with ack)', done => {
        helpers(
            {
                type: PacketType.EVENT,
                data: ['a', 1, {}],
                id: 1,
                nsp: '/test',
            },
            done,
        );
    });

    it('encodes an ack', done => {
        helpers(
            {
                type: PacketType.ACK,
                data: ['a', 1, {}],
                id: 123,
                nsp: '/',
            },
            done,
        );
    });

    it('encodes an connect error', done => {
        helpers(
            {
                type: PacketType.CONNECT_ERROR,
                data: 'Unauthorized',
                nsp: '/',
            },
            done,
        );
    });

    it('encodes an connect error (with object)', done => {
        helpers(
            {
                type: PacketType.CONNECT_ERROR,
                data: {
                    message: 'Unauthorized',
                },
                nsp: '/',
            },
            done,
        );
    });

    it('throws an error when encoding circular objects', () => {
        const a: Record<string, unknown> = {};
        a.b = a;

        const data = {
            type: PacketType.EVENT,
            data: a,
            id: 1,
            nsp: '/',
        };

        const encoder = new Encoder();

        assert.throws(() => encoder.encode(data));
    });

    it('decodes a bad binary packet', () => {
        const decoder = new Decoder();
        const errorObject: any = '5';
        assert.throws(() => {
            decoder.add(errorObject); // eslint-disable-line @typescript-eslint/no-unsafe-argument
        }, /invalid packet/);
    });

    it('decodes with bad namespace', () => {
        const data = {
            type: PacketType.EVENT,
            data: [],
            nsp: null,
        };

        const encoder = new Encoder();
        const encodedPackets = encoder.encode(data);
        const decoder = new Decoder();

        assert.throws(() => {
            decoder.add(encodedPackets[0]);
        }, /invalid packet namespace/);
    });

    it('decodes with bad payload', () => {
        const data = {
            type: PacketType.EVENT,
            data: null,
            nsp: '/',
        };

        const encoder = new Encoder();
        const encodedPackets = encoder.encode(data);
        const decoder = new Decoder();

        assert.throws(() => {
            decoder.add(encodedPackets[0]);
        }, /invalid packet payload/);
    });

    it('throw an error upon parsing error', () => {
        const isInvalidPayload = (errorObject: any) => {
            assert.throws(() => {
                new Decoder().add(errorObject); // eslint-disable-line @typescript-eslint/no-unsafe-argument
            });
        };

        isInvalidPayload('442["some","data"');
        isInvalidPayload('0/admin,"invalid"');
        isInvalidPayload('1/admin,{}');
        isInvalidPayload('2/admin,"invalid');
        isInvalidPayload('2/admin,{}');
    });
});
