import * as nodeRepository from 'repositorys/nodeDB';
import * as edgeRepository from 'repositorys/edgeDB';
import { Context } from 'koa';
import { Edge } from 'validation/edgeCodec';
import { Node } from 'validation/nodeCodec';

type Graph = Record<number, number[]>;

const buildGraph = async (): Promise<Graph> => {
    const nodes : Node[]  = await nodeRepository.getAll();   
    const edges : Edge[]  = await edgeRepository.getAll();

    const graph: Graph = {};
    nodes.forEach((node) => { 
        graph[node.id] = [];
    });
    
    edges.forEach(({ node1_id, node2_id }) => {
        graph[node1_id].push(node2_id);
        graph[node2_id].push(node1_id);
    });
    return graph;
};

export const getConnectedComponents = async (ctx: Context) => {
    const graph = await buildGraph();
    
    const visited = new Set<number>();
    const components: number[][] = [];

    const dfs = (node: number, comp: number[]) => {
        visited.add(node);
        comp.push(node);
        for (const id of graph[node]) {
        if (!visited.has(id)) dfs(id, comp);
        }
    };

    for (const node in graph) {
        const id = parseInt(node);
        if (!visited.has(id)) {
        const comp: number[] = [];
        dfs(id, comp);
        components.push(comp);
        }
    }

    ctx.body = { components };
};

export const checkCycle = async (ctx: Context) => {
    const nodes : Node[] = await nodeRepository.getAll();    
    const graph = await buildGraph();

        const visited = new Set<number>();

    const hasCycle = (node:number, parent: number | null): boolean =>{
        visited.add(node);
        for(const id of graph[node]){
            if(!visited.has(id)){
                if(!hasCycle(id,node)){
                    return true;
                }
                else if (id !== node){
                    return true
                }
            }
        }
        return false
    };

    for(const node of nodes ){
        if(!visited.has(node.id) && hasCycle(node.id,null)){
            ctx.body = {hasCycle: true};
            return
        }
    }
    ctx.body = {hasCycle: false};
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

export const getAllPaths = async (ctx: Context) => {
    const { startId, endId } = ctx.request.body as { startId: number, endId: number };
    const graph = await buildGraph();

    const paths: number[][] = [];
    const visited = new Set<number>();

    const dfs = (node: number, path: number[]) => {
        visited.add(node);
        path.push(node);
        if (node === endId) {
            paths.push([...path]);
        } else {
            for(const newNode of graph[node]) {
                if (!visited.has(newNode)){
                    dfs(newNode, path);
                }
            }
        }
        path.pop();
        visited.delete(node);
    };

    dfs(startId, []);
    ctx.body = { paths };
}
