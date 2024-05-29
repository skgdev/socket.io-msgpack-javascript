/* eslint-disable @typescript-eslint/naming-convention */
import { type DecodeOptions, type EncodeOptions, ExtensionCodec } from '@msgpack/msgpack';
import buildDecoder from './decoder';
import buildEncoder from './encoder';
import { PacketType } from './packet-format';

export const build = (options: {encoder?: EncodeOptions; decoder?: DecodeOptions} = {}) => ({
    protocol: 5,
    Encoder: buildEncoder(options.encoder),
    Decoder: buildDecoder(options.decoder),
    PacketType,
    ExtensionCodec,
});

const customParser = {
    build,
};

export default customParser;
