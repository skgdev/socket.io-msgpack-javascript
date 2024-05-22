import { PacketType } from '../src/packet-format';
import helpers from './helpers';

describe('parser', () => {
    it('encodes a TypedArray', done => {
        const array = new Uint8Array(5);
        for (let i = 0; i < array.length; i++) {
            array[i] = i;
        }

        const packet = {
            type: PacketType.EVENT,
            data: ['a', array],
            id: 0,
            nsp: '/',
        };
        helpers(packet, done);
    });

    it('encodes TypedArray deep in JSON', done => {
        const packet = {
            type: PacketType.EVENT,
            data: [
                'a',
                {
                    a: 'hi',
                    b: { why: new Uint8Array(35) },
                    c: { a: 'bye', b: { a: new Uint8Array(6) } },
                },
            ],
            id: 999,
            nsp: '/deep',
        };
        helpers(packet, done);
    });

    it('encodes deep binary JSON with null values', done => {
        const packet = {
            type: PacketType.EVENT,
            data: ['a', {
                a: 'b', c: 4, e: { g: null }, h: new Uint8Array(97),
            }],
            nsp: '/',
            id: 600,
        };
        helpers(packet, done);
    });
});
