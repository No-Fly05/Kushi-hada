import { Codec, GetType, string, number } from 'purify-ts/Codec';

export const CreateNodeCodec = Codec.interface({
  lable: string
});

export const NodeParamsCodec = Codec.interface({
  id: number
});

export type CreateNode = GetType<typeof CreateNodeCodec>
export type Node = {
    id:number,
    lable:string,
}