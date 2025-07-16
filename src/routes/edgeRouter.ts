import Router from '@koa/router';
import { CreateEdgeCodec, DeleteEdgeCodec } from 'validation/edgeCodec';
import { validateBody } from 'middleware/validateBody';
import { getEdge, postEdge, deleteEdge } from 'controllers/edgeController';

export const edgeRouter = new Router().prefix('/edges');

edgeRouter.get('/:node1_id/:node2_id', getEdge);
edgeRouter.post('/', validateBody(CreateEdgeCodec), postEdge);
edgeRouter.delete('/', validateBody(DeleteEdgeCodec), deleteEdge);
