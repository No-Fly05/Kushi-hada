import { Edge } from 'validation/edgeCodec';
import { Repository } from './repository';
export interface EdgeRepository extends Repository<Edge>{
    save: (input: { node1_id: number; node2_id: number }) => Promise<Edge>;
    getByNodes: (node1_id: number, node2_id: number) => Promise<Edge>;
    deleteEdge: (node1_id: number, node2_id: number) => Promise<void>;
    countByNodeId(nodeId: number): Promise<number>;
}