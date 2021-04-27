const customParser = require('../index');
const expect = require('expect.js');

const parser = customParser.build();
const encoder = new parser.Encoder();

module.exports.test = (obj, done) => {
    const encodedPackets = encoder.encode(obj);

    const decoder = new parser.Decoder();
    decoder.on('decoded', (packet) => {
        expect(packet).to.eql(obj);
        done();
    });

    decoder.add(encodedPackets[0]);
};
