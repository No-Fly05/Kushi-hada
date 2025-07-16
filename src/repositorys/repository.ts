export type RepositoryGetAll<T> = () => Promise<(T[])>
export type RepositoryGet<T> = (id:number) => Promise<T | undefined>
export type RepositorySave<T> = (object: T) => Promise<T>
export type RepositoryDelete<T> = (id:number) => Promise<T | undefined | void>

export interface Repository<T> {
    getAll: RepositoryGetAll<T>
    get: RepositoryGet<T>
    save: RepositorySave<T>
    delete: RepositoryDelete<T>
}