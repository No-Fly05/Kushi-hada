import db from '../db/db';
import * as nodeRepository from 'repositorys/nodeDB';
import { Edge } from 'validation/edgeCodec';
import { NotFoundError, BadRequestError } from 'middleware/errors'; 
import { EdgeRepository } from './edge.repository';

const edgeDb = db('edge')

export const edgeRepository : EdgeRepository = {
  getAll: async () => {
    return edgeDb.select('node1_id' ,'node2_id');
  },

  get: async (id: number) => {
    const edge : Edge | undefined = edgeDb.where('id',id);
    if(!edge) throw new NotFoundError('id was not found')
     
    return edge;
  },

  getByNodes: async (node1_id: number, node2_id: number) => {
    const edge : Edge = edgeDb
    .where({ node1_id: node1_id, node2_id: node2_id })
    .orWhere({ node1_id: node2_id, node2_id: node1_id })
    .first();

    if(!edge){
      throw new NotFoundError('edge not found');
    }
    return edge;
  },

  save: async ({node1_id , node2_id}) => {
    if (!node1_id || !node2_id){
      throw new BadRequestError('Both IDs required');
    }
    if (node1_id == node2_id) {
      throw new BadRequestError('Self-referencing edge is not allowed');
    }

    if(!nodeRepository.get(node1_id) || !nodeRepository.get(node2_id)){
      throw new NotFoundError('One or both nodes not exist');
    }
    
    const exists = await edgeDb
    .where({ node1_id, node2_id })
    .orWhere({ node1_id: node2_id, node2_id: node1_id })
    .first();

    if (exists) {
      throw new BadRequestError('Edge already exists');
    }

    const [edge] = await edgeDb.insert({ node1_id, node2_id }).returning('*');
    return edge;
  },

  delete: async (id:number) =>{
    const deletedCount = edgeDb.where('id',id).del()

    if(deletedCount == 0){
      throw new NotFoundError('edge not found');
    }
  },

  deleteEdge(node1_id:number, node2_id:number) {
    const deletedCount = edgeDb.where({ node1_id: node1_id, node2_id:node2_id })
    .orWhere({ node1_id: node2_id, node2_id: node1_id }).del()

    if(deletedCount == 0){
      throw new NotFoundError('edge not found');
    }
  },
}

export const getAll = (): Promise<Edge[]> => edgeDb.select('node1_id' ,'node2_id');

export const get = async (node1_id:number, node2_id:number) : Promise<Edge> =>{  
    const edge = edgeDb
    .where({ node1_id: node1_id, node2_id: node2_id })
    .orWhere({ node1_id: node2_id, node2_id: node1_id })
    .first();

    if(!edge){
      throw new NotFoundError('edge not found')
    }
    return edge;
}
export const save = async (node1_id:number, node2_id:number): Promise<Edge> => {

  if(!node1_id && !node2_id){
    throw new BadRequestError('required both ids to create edge')  
  }  
  
  if(node1_id == node2_id){
    throw new BadRequestError('cant create edge from node to the same node')
  }

  if(!nodeRepository.get(node1_id) && !nodeRepository.get(node2_id)){
      throw new NotFoundError('one or both nodes do not exist');
    }

  const edge = await get(node1_id,node2_id) as Edge;
  
  if (edge) {
    throw new BadRequestError('edge already exsits')
  
  }

    const [saveEdge] = edgeDb.insert({node1_id, node2_id}).returning('*')
    return edge;
}

export const deleteEdge = async (node1_id:number, node2_id:number) : Promise<void> =>{
  const deletedCount = edgeDb.where({ node1_id: node1_id, node2_id:node2_id })
  .orWhere({ node1_id: node2_id, node2_id: node1_id }).del()

  if(deletedCount == 0){
    throw new NotFoundError('edge not found');
  }
}

export const countByNodeId = async (id: number): Promise<number> => {
const result = await db('edge')
  .where('node1_id', id)
  .orWhere('node2_id', id)
  .count('* as count')
  .first() as { count: string | undefined };
  return parseInt(result?.count || '0', 10);
};