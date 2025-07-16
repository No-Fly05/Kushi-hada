import * as edgeRepository from 'repositorys/edgeDB';
import * as nodeRepository from 'repositorys/nodeDB';
import { Context } from 'koa';
import { CreateEdge, Edge } from 'validation/edgeCodec';
import { NotFoundError, BadRequestError } from 'middleware/errors'; 

export const getEdge = async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdge;

  const edge = await edgeRepository.get(node1_id,node2_id) as Edge;

  ctx.status = 200;
  ctx.body = { edge };

}

export const postEdge = async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdge;
  
  const saveEdge = await edgeRepository.save(node1_id,node2_id) as Edge;

  ctx.status = 201;
  ctx.body = {saveEdge};
}

export const deleteEdge = async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdge;

  await edgeRepository.deleteEdge(node1_id,node2_id);
  ctx.status = 201;
  ctx.body = {message: 'Edge was deleted'}
}