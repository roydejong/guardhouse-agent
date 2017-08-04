module.exports = {
    register: function (express) {
        express.get('/status', function (req, res) {
            res.send('Hello World!')
        })
    }  
};