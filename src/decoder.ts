/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import msgpack from '@msgpack/msgpack';
import Emitter from 'component-emitter';
import { isInteger, isObject, isString } from './type-checkers';
import { PacketType } from './packet-format';
import validatePacketData from './validate-packet-data';

export class DecoderClass extends Emitter {
    options: msgpack.DecodeOptions = {};
    add(buffer: ArrayLike<number> | BufferSource) {}
    validatePacket(decoded: unknown) {}
    destroy() {}
}

const buildDecoder = (options: msgpack.DecodeOptions = {}): typeof DecoderClass => class Decoder extends Emitter {
    options;

    constructor() {
        super();
        this.options = options;
    }

    add(buffer: ArrayLike<number> | BufferSource) {
        const decoded = msgpack.decode(buffer, this.options);
        this.validatePacket(decoded);
        this.emit('decoded', decoded);
    }

    validatePacket(decoded: unknown) {
        if (!isObject(decoded)) {
            throw new Error('invalid packet');
        }

        const isValidTypeField = isInteger(decoded.type)
                                && decoded.type >= PacketType.CONNECT
                                && decoded.type <= PacketType.CONNECT_ERROR;

        if (!isValidTypeField) {
            throw new Error('invalid packet type');
        }

        if (!isString(decoded.nsp)) {
            throw new Error('invalid packet namespace');
        }

        if (!validatePacketData(decoded)) {
            throw new Error('invalid packet payload');
        }

        if (undefined !== decoded.id && !isInteger(decoded.id)) {
            throw new Error('invalid packet id');
        }
    }

    destroy() {}
};

export default buildDecoder;
