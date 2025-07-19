import { edgeRepository } from "dbAccsess/edgeDB";
import { nodeRepository } from "dbAccsess/nodeDB";
import { Context } from "koa";
import { Edge } from 'validation/edgeCodec';
import { Node } from 'validation/nodeCodec';

type Graph = Record<number, number[]>;

export class GraphService{
    private graph: Graph = {};
    private nodes: Node[] = [];

    async build(): Promise<void> {
        this.nodes = await nodeRepository.getAll();
        const edges : Edge[]  = await edgeRepository.getAll();

        this.graph = {};
        this.nodes.forEach((node) => { 
            this.graph[node.id] = [];
        });
        
        edges.forEach(({ node1_id, node2_id }) => {
            this.graph[node1_id].push(node2_id);
            this.graph[node2_id].push(node1_id);
        });
    }

    getConnectedComponents(): number[][] {
        const visited = new Set<number>();
        const components: number[][] = [];

        const dfs = (node: number, comp: number[]) => {
            visited.add(node);
            comp.push(node);
            for (const id of this.graph[node]) {
            if (!visited.has(id)) dfs(id, comp);
            }
        };

        for (const node in this.graph) {
            const id = parseInt(node);
            if (!visited.has(id)) {
            const comp: number[] = [];
            dfs(id, comp);
            components.push(comp);
            }
        }

        return components;
    }

    hasCycle(): boolean {
        const visited = new Set<number>();

        const dfs = (node: number, parent: number | null): boolean => {
        visited.add(node);
        
        for (const neighbor of this.graph[node]) {
            if (!visited.has(neighbor)) {
            
                if (dfs(neighbor, node)) return true;
            } else if (neighbor !== parent) {
                return true;
            }
        }
        return false;
        };

        for (const node of this.nodes) {
            if (!visited.has(node.id)) {
                if (dfs(node.id, null)) {
                    return true;
                }
            }
        }

        return false;
    }

    getAllPaths(startId: number, endId: number): number[][] {
        const paths: number[][] = [];
        const visited = new Set<number>();

        const dfs = (node: number, path: number[]) => {
        visited.add(node);
        path.push(node);

        if (node === endId) {
            paths.push([...path]);
        } else {
            for (const neighbor of this.graph[node]) {
                if (!visited.has(neighbor)) {
                    dfs(neighbor, path);
                }
            }
        }

        path.pop();
        visited.delete(node);
        };

        dfs(startId, []);
        return paths;
  }
}