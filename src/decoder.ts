/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import msgpack from '@msgpack/msgpack';
import Emitter from 'component-emitter';
import isString from 'lodash/isString';
import { PacketType } from './packet-format';
import validatePacketData from './validate-packet-data';
import { objectIsInteger, isRecord } from './type-checkers';

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
        if (!isRecord(decoded)) {
            throw new Error('invalid packet');
        }

        const isValidTypeField = objectIsInteger(decoded.type)
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

        if (undefined !== decoded.id && !objectIsInteger(decoded.id)) {
            throw new Error('invalid packet id');
        }
    }

    destroy() {}
};

export default buildDecoder;
