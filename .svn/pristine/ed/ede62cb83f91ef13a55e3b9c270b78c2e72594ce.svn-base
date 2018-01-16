import express from 'express';
import path from 'path';
import morgan from 'morgan';
import historyApiFallback from 'connect-history-api-fallback';
const app = express();
app.use(historyApiFallback());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist')));
const server = app.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
