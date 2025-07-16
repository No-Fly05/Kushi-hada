import Router from '@koa/router';
import { NodeDegreeCodec, AllPathsCodec } from 'validation/graphCodec';
import { validateBody } from 'middleware/validateBody';
import {getConnectedComponents, checkCycle, getNodeDegree, getAllPaths} from '../controllers/graphControl'

export const graphRouter = new Router().prefix('/graph');

graphRouter.get('/connected-components', getConnectedComponents);
graphRouter.get('/cycle', checkCycle);
graphRouter.post('/node-degree', validateBody(NodeDegreeCodec), getNodeDegree);
graphRouter.post('/all-paths', validateBody(AllPathsCodec), getAllPaths);
