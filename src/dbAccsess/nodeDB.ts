import db from '../db/db';
import { NodeRepository } from '../repositorys/node.repository';
import { Node } from 'validation/nodeCodec';
import { NotFoundError } from 'middleware/errors'; 

const nodeDb = db('node')

export const nodeRepository : NodeRepository = {
    save: async ({lable}) => {
        const [node] = await nodeDb.insert( {lable} ).returning('*') as Node[];
        return node;
    },
    
    getAll: async () => {
        return await nodeDb.select('id');
    },

    get: async (id: number) => {
        const node: Node | undefined = await nodeDb.where({ id }).first();
        if (!node) {
        throw new NotFoundError('Node not found');
        }
        return node;
    },

    delete: async (id: number) => {
        const deletedCount = nodeDb.where('id', id).del()
    
        if(deletedCount == 0){
            throw new NotFoundError('node not found');
        }
    }
}
