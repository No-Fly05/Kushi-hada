import Router from '@koa/router';
import db from "../db/db";
import { error } from 'console';

const router = new Router();

router.get('/nodes/:id', async (ctx) => {
  const { id } = ctx.params;
  const node = await db('node').where({ id }).first();

  if (node) {
    ctx.body = node;
  } else {
    ctx.status = 404;
    ctx.body = {error: 'Node not found'}
  }
});

router.post('/nodes', async (ctx) => {
  const { label } = ctx.request.body as { label: string };

  if (!label) {
    ctx.status = 400;
    ctx.body = { error: 'Label is required' };
    return;
  }

  const [newNode] = await db('node')
    .insert({ label })
    .returning('*');  // returns the newly created node

  ctx.body = newNode;
});

router.delete('/nodes/:id',async (ctx) => {
  const { id } = ctx.params;

  await db.transaction(async (trx: (arg0: string) => { (): any; new(): any; where: { (arg0: string, arg1: string): { (): any; new(): any; orWhere: { (arg0: string, arg1: string): { (): any; new(): any; del: { (): any; new(): any; }; }; new(): any; }; del: { (): any; new(): any; }; }; new(): any; }; }) => {
    await trx('edge').where('node1_id', id).orWhere('node2_id', id).del();

    const deleteCount = await trx('node').where('id', id).del();
    
    if (deleteCount == 0) {
      ctx.status = 404;
      ctx.body = {error: 'Node not found'}
      return;
    }

    ctx.body = {message: 'Node and edges was deleted'}
  });
});

export default router;