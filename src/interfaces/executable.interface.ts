export interface IExecutable<TRequest, TResponse> {
    execute(payload: TRequest): Promise<TResponse>
}