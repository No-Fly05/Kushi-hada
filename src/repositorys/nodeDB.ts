import db from '../db/db';

import { Node } from 'validation/nodeCodec';
import { NotFoundError } from 'middleware/errors'; 

const nodeDb = db('node')

export const getAll = () : Promise<Node[]> => nodeDb.select('id'); 

export const get = async(id:number) : Promise<Node> => {
    const node : Node | undefined = nodeDb.where({ id }).first();
    
    if (!node) {
        throw new NotFoundError('Node not found');
    } 
    return node;
    
};
export const set = (lable:string) : Promise<Node> =>{ 
    const [node] =nodeDb.insert({ lable }).returning('*');
    return node;
};
export const remove  = async(id:number) : Promise<void> => {
    const deletedCount = nodeDb.where('id', id).del()
    if(deletedCount == 0){
        throw new NotFoundError('node not found');
    }
};