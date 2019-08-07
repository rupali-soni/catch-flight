const app = require('./app')
const port = process.env.PORT | 4000

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})