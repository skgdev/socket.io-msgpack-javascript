exports = {};

exports.build = function (options = {}) {
    return {
        protocol: 5,
        Encoder: new Encoder(options.encoder),
        Decoder: new Decoder(options.decoder)
    }
}
