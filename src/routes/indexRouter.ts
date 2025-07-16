import Router from '@koa/router';

export { nodeRouter } from './nodeRouter';
export { edgeRouter } from './edgeRouter';
export { graphRouter } from './graphRouter';

export const makeAppRouter = (routes :Router[]) => {
  const router = new Router();

  routes.forEach((r) => {
    router.use( r.routes(), r.allowedMethods());
  });

  return router;
};