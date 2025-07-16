import { Codec } from 'purify-ts/Codec';
import { Context, Next } from 'koa';
import { AppError } from './errors';

export const validateBody = <T>(codec: Codec<T>) =>{
    return async (ctx: Context, next: Next) => {
        const result = codec.decode(ctx.request.body);

        if (result.isLeft()) {
            throw new AppError('Invalid request body');
        } 
        
        await next();
    };
}; 

export const validateParams = <T>(codec: Codec<T>) => {
  return async (ctx: Context, next: Next) => {
    const result = codec.decode(ctx.params);

    if (result.isLeft()) {
      throw new AppError('Invalid request body');
    }

    ctx.state.validatedParams = result.extract();
    await next();
  };
};