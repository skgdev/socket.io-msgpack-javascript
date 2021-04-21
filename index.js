const buildEncoder = require('./src/encoder');
const buildDecoder = require('./src/decoder');
const PacketType = require('./src/packetType');

exports.build = function (options = {}) {
    return {
        protocol: 5,
        Encoder: buildEncoder(options.encoder),
        Decoder: buildDecoder(options.decoder),
        PacketType: PacketType,
    };
};
