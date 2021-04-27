const PacketType = require('../src/packetType');
const buildEncoder = require('../src/encoder');
const buildDecoder = require('../src/decoder');
const expect = require('expect.js');
const helpers = require('./helpers.js');

const Encoder = buildEncoder();
const Decoder = buildDecoder();

describe('parser', () => {
    it('exposes types', () => {
        expect(PacketType.CONNECT).to.be.a('number');
        expect(PacketType.DISCONNECT).to.be.a('number');
        expect(PacketType.EVENT).to.be.a('number');
        expect(PacketType.ACK).to.be.a('number');
        expect(PacketType.CONNECT_ERROR).to.be.a('number');
    });

    it('encodes connection', (done) => {
        helpers.test(
            {
                type: PacketType.CONNECT,
                nsp: '/woot',
                data: {
                    token: '123',
                },
            },
            done
        );
    });

    it('encodes disconnection', (done) => {
        helpers.test(
            {
                type: PacketType.DISCONNECT,
                nsp: '/woot',
            },
            done
        );
    });

    it('encodes an event', (done) => {
        helpers.test(
            {
                type: PacketType.EVENT,
                data: ['a', 1, {}],
                nsp: '/',
            },
            done
        );
    });

    it('encodes an event (with an integer as event name)', (done) => {
        helpers.test(
            {
                type: PacketType.EVENT,
                data: [1, 'a', {}],
                nsp: '/',
            },
            done
        );
    });

    it('encodes an event (with ack)', (done) => {
        helpers.test(
            {
                type: PacketType.EVENT,
                data: ['a', 1, {}],
                id: 1,
                nsp: '/test',
            },
            done
        );
    });

    it('encodes an ack', (done) => {
        helpers.test(
            {
                type: PacketType.ACK,
                data: ['a', 1, {}],
                id: 123,
                nsp: '/',
            },
            done
        );
    });

    it('encodes an connect error', (done) => {
        helpers.test(
            {
                type: PacketType.CONNECT_ERROR,
                data: 'Unauthorized',
                nsp: '/',
            },
            done
        );
    });

    it('encodes an connect error (with object)', (done) => {
        helpers.test(
            {
                type: PacketType.CONNECT_ERROR,
                data: {
                    message: 'Unauthorized',
                },
                nsp: '/',
            },
            done
        );
    });

    it('throws an error when encoding circular objects', () => {
        const a = {};
        a.b = a;

        const data = {
            type: PacketType.EVENT,
            data: a,
            id: 1,
            nsp: '/',
        };

        const encoder = new Encoder();

        expect(() => encoder.encode(data)).to.throwException();
    });

    it('decodes a bad binary packet', () => {
        try {
            const decoder = new Decoder();
            decoder.add('5');
        } catch (e) {
            expect(e.message).to.match(/invalid packet type/);
        }
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

        expect(() => decoder.add(encodedPackets[0])).to.throwException(/invalid namespace/);
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

        expect(() => decoder.add(encodedPackets[0])).to.throwException(/invalid payload/);
    });

    it('throw an error upon parsing error', () => {
        const isInvalidPayload = (str) => expect(() => new Decoder().add(str)).to.throwException();

        isInvalidPayload('442["some","data"');
        isInvalidPayload('0/admin,"invalid"');
        isInvalidPayload('1/admin,{}');
        isInvalidPayload('2/admin,"invalid');
        isInvalidPayload('2/admin,{}');

        expect(() => new Decoder().add('999')).to.throwException();
    });
});
