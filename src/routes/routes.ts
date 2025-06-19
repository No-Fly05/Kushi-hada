import Router from '@koa/router';
import edgeRoutes from './edgeRoutes';
import nodeRoutes from './nodeRoutes';
import db from "../db/db";
import { Context } from 'koa';
import { connected } from 'process';

const router = new Router();

router.use('/edges', edgeRoutes.routes(), edgeRoutes.allowedMethods());
router.use('/nodes', nodeRoutes.routes(), nodeRoutes.allowedMethods());

export default router;

router.get('/graph/connected-components', async (ctx) => {
    const nodes = await db('node').select('id');    
    const edges = await db('edge').select   ('node1_id' ,'node2_id');

    const graph: Record<number, number[]> = {};
    nodes.forEach((id:number) => { graph[id] = []});
    edges.forEach((node1_id:number, node2_id:number) =>{ 
    graph[node1_id].push(node2_id);
    graph[node2_id].push(node1_id);
    });

    const visited = new Set<number>();
    const components: number[][] = [];

    const dfc = (node: number, comp: number[]) => {
        visited.add(node);
        comp.push(node);

        graph[node].forEach((id: number) => {
            if(!visited.has(id)) {
                dfc(id,comp);   
            }
        });
    }

    for( const {id} of nodes){
        if(!visited.has(id)){
            const comp: number[] = [];
            dfc(id,comp)
            components.push(comp);
        }
    }
})

router.get('/graph/cycle', async (ctx)=>{
    const nodes = await db('node').select('id');    
    const edges = await db('edge').select   ('node1_id' ,'node2_id');

    const graph: Record<number, number[]> = {};
    nodes.forEach((id:number) => { graph[id] = []});
    edges.forEach((node1_id:number, node2_id:number) =>{ 
    graph[node1_id].push(node2_id);
    graph[node2_id].push(node1_id);
    });

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

    for(const id of nodes ){
        if(visited.has(id) && hasCycle(id,null)){
            ctx.body = {hasCycle: true};
            return
        }
    }
    ctx.body = {hasCycle: false};
})

router.post('/graph/node-degree', async (ctx) => {
    const {nodeIds} = ctx.request.body as {nodeIds: number[]};

    const degrees = await Promise.all(nodeIds.map(async (id)  => {
        const count = await db('edge')
        .where('node1_id', id)
        .orWhere('node2_id', id)
        .count('*')
        .first();
        
        return {nodeId: id, degree: count} ;
    }));

    ctx.body = { degrees };
});

router.post('/graph/all-paths', async (ctx) => {
    const { startId, endId } = ctx.request.body as { startId: number, endId: number };
    const nodes = await db('node').select('id');    
    const edges = await db('edge').select   ('node1_id' ,'node2_id');

    const graph: Record<number, number[]> = {};
    nodes.forEach((id:number) => { graph[id] = []});
    edges.forEach((node1_id:number, node2_id:number) =>{ 
    graph[node1_id].push(node2_id);
    graph[node2_id].push(node1_id);
    });

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
});

