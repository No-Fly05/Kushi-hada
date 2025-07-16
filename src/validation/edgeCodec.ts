import { Codec, GetType, number } from 'purify-ts/Codec';

const IdsEdgeCodec = Codec.interface({
  node1_id: number,
  node2_id: number,
});

export const CreateEdgeCodec = IdsEdgeCodec
export const DeleteEdgeCodec = IdsEdgeCodec

export type CreateEdge = GetType<typeof CreateEdgeCodec>
export type Edge = {
  id: number,
  node1_id: number,
  node2_id: number,
}