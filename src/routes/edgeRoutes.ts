import Router from '@koa/router';

import db from "../db/db";
import { Context } from 'koa';
import { error } from 'console';

const router = new Router();

type CreateEdgeBody = {
  node1_id: number;
  node2_id: number;
};

router.post('/edges', async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdgeBody;
  
  //check if one of request id's is null 
  if(!node1_id || !node2_id){
    ctx.status = 404;
    ctx.body = {error: 'required both ids to create edge'};
    return;
  }

  //check if id1 is the same as id2
  if(node1_id == node2_id){
    ctx.status = 400;
    ctx.body = {error: 'cant create edge from node to the same node'};
    return;
  }

  //check if nodes exist
  const nodes = await db('node').whereIn('id',[node1_id, node2_id]);
  if (nodes.length != 2){
    ctx.status = 400;
    ctx.body = {error: 'one or both nodes do not exist'};
    return;
  } 

  //check if edge alredy exist
    const edges = await db('edge').where({ node1_id: node1_id, node2_id:node2_id })
            .orWhere({ node1_id: node2_id, node2_id: node1_id });
  
  if (edges.length > 0) {
    ctx.status = 400;
    ctx.body = {error: 'edge already exsits'};
  }

  const [edge] = await db('edge').instert({node1_id, node2_id}).returning('*');

  ctx.status = 201;
  ctx.body = {edge};
});

router.delete('/edges', async (ctx) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdgeBody;

  //check if edge alredy exist
  const edges = await db('edge').where({ node1_id: node1_id, node2_id:node2_id })
    .orWhere({ node1_id: node2_id, node2_id: node1_id });
  
    if (edges.length == 0) {
      ctx.status = 404;
      ctx.body = {error: 'edge not exists'};
      return;
    }

    await db('edge').where({ node1_id: node1_id, node2_id:node2_id })
            .orWhere({ node1_id: node2_id, node2_id: node1_id }).del()
    ctx.status = 201;
    ctx.body = {message: 'Edge was deleted'}
});



export default router;