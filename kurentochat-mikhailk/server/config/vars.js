module.exports = {
    origin: process.env.ORIGIN || 'http://localhost:3000',
    port: process.env.PORT || 3001,
    kurentoUrl: process.env.KURENTO_URL || 'ws://localhost:8888/kurento',
}