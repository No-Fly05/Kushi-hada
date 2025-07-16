import * as nodeRepository from 'repositorys/nodeDB';
import * as edgeRepository from 'repositorys/edgeDB';
import { Context } from 'koa';
import { CreateNode, Node } from 'validation/nodeCodec';

export const postNode = async (ctx: Context ) => {
    const { lable } = ctx.request.body as CreateNode;
  
    const node : Node = await nodeRepository.set(lable);
    ctx.status = 201;
    ctx.body = { node };
};

export const getNode = async (ctx: Context) => {
    const id  = ctx.params.id as number;
    const node : Node | undefined = await nodeRepository.get(id);
    ctx.body = node;
};

export const deleteNode = async (ctx: Context) => {
  const id = ctx.params.id as number ;

  await edgeRepository.deleteEdge(id,id);
  {
    await nodeRepository.remove(id);

    ctx.body = {message: 'Node and edges was deleted'}
  };
};
