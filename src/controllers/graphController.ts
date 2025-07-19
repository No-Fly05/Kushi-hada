import {edgeRepository} from 'dbAccsess/edgeDB';
import { Context } from 'koa';
import { GraphService } from 'services/GraphService';

const initGraphService = async (): Promise<GraphService> => {
  const graphService = new GraphService();
  await graphService.build();
  return graphService;
};

export const getConnectedComponents = async (ctx: Context) => {
    const graphService = await initGraphService();
    const components =  await graphService.getConnectedComponents();
    ctx.body = { components };
};

export const checkCycle = async (ctx: Context) => {
    const graphService = await initGraphService();
    const hasCycle = await graphService.hasCycle();
    ctx.body = { hasCycle }; 
};

export const getAllPaths = async (ctx: Context) => {
  const { startId, endId } = ctx.request.body as { startId: number, endId: number };
  const graphService = await initGraphService();
  const paths =  await graphService.getAllPaths(startId, endId);
  ctx.body = { paths };
};


export const getNodeDegree = async (ctx: Context) => {
  const { nodeIds } = ctx.state.validatedBody as { nodeIds: number[] };

  const degrees = await Promise.all(
    nodeIds.map(async (id) => {
      const degree = await edgeRepository.countByNodeId(id);
      return { nodeId: id, degree };
    })
  );

  ctx.body = { degrees };
};

