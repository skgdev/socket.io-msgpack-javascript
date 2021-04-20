const buildEncoder = require('./lib/encoder');
const buildDecoder = require('./lib/decoder');
const PacketType = require('./lib/packetType');

exports.build = function (options = {}) {
    return {
        protocol: 5,
        Encoder: buildEncoder(options.encoder),
        Decoder: buildDecoder(options.decoder),
        PacketType: PacketType,
    };
};
