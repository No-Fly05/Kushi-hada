import { Node } from 'validation/nodeCodec';
import { Repository } from './repository';

export interface NodeRepository extends Repository<Node>{
    save: (input:{lable:string}) => Promise<Node>
}