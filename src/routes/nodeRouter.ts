import Router from '@koa/router';
import { validateBody,validateParams } from 'middleware/validateBody';
import { CreateNodeCodec, NodeParamsCodec } from 'validation/nodeCodec';
import { postNode, getNode, deleteNode } from '../controllers/nodeController';

export const nodeRouter = new Router();

nodeRouter.prefix('/nodes')

nodeRouter.get('/:id', validateParams(NodeParamsCodec), getNode);
nodeRouter.post('/',validateBody(CreateNodeCodec), postNode);
nodeRouter.delete('/:id', validateParams(NodeParamsCodec), deleteNode);