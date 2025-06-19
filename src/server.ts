import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes/routes';

const app = new Koa();

app.use(bodyParser());
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });