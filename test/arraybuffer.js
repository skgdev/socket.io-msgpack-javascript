const PacketType = require('../src/packetType');
const helpers = require('./helpers.js');

describe('parser', () => {
    it('encodes an ArrayBuffer', (done) => {
        const packet = {
            type: PacketType.EVENT,
            data: ['a', new ArrayBuffer(2)],
            id: 0,
            nsp: '/',
        };
        helpers.test(packet, done);
    });

    it('encodes a TypedArray', (done) => {
        const array = new Uint8Array(5);
        for (let i = 0; i < array.length; i++) array[i] = i;

        const packet = {
            type: PacketType.EVENT,
            data: ['a', array],
            id: 0,
            nsp: '/',
        };
        helpers.test(packet, done);
    });

    it('encodes ArrayBuffers deep in JSON', (done) => {
        const packet = {
            type: PacketType.EVENT,
            data: [
                'a',
                {
                    a: 'hi',
                    b: { why: new ArrayBuffer(3) },
                    c: { a: 'bye', b: { a: new ArrayBuffer(6) } },
                },
            ],
            id: 999,
            nsp: '/deep',
        };
        helpers.test(packet, done);
    });

    it('encodes deep binary JSON with null values', (done) => {
        const packet = {
            type: PacketType.EVENT,
            data: ['a', { a: 'b', c: 4, e: { g: null }, h: new ArrayBuffer(9) }],
            nsp: '/',
            id: 600,
        };
        helpers.test(packet, done);
    });
});
