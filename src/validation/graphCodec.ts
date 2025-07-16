    import { Codec, array, number } from "purify-ts";

    export const NodeDegreeCodec = Codec.interface({
        nodeIds: array(number)
    });

    export const AllPathsCodec = Codec.interface({
        startId: number,
        endId: number,
    });