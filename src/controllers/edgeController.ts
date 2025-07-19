import { edgeRepository } from 'repositorys/edgeDB';
import { Context } from 'koa';
import { CreateEdge, Edge } from 'validation/edgeCodec';

export const getEdge = async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdge;

  const edge = await edgeRepository.getByNodes(node1_id,node2_id);

  ctx.status = 200;
  ctx.body = { edge };

}

export const postEdge = async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdge;
  
  const saveEdge = await edgeRepository.save({node1_id, node2_id}) as Edge;

  ctx.status = 201;
  ctx.body = saveEdge;
}

export const deleteEdge = async (ctx: Context) => {
  const {node1_id, node2_id} = ctx.request.body as CreateEdge;

  await edgeRepository.deleteEdge(node1_id,node2_id);
  ctx.status = 201;
  ctx.body = {message: 'Edge was deleted'}
}