import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import { nodeRouter, edgeRouter, graphRouter } from './routes/indexRouter';
import { makeAppRouter } from './routes/indexRouter';

const routes = [
  nodeRouter,
  edgeRouter,
  graphRouter,
];

const app = new Koa();
const router = makeAppRouter(routes);


app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on http://localhost:${PORT}');
  });