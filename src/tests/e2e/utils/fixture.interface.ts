import { ResolveDependency } from "../../../infrastructure/config/dependency-injection";

export interface IFixture {
    load(container: ResolveDependency): Promise<void>
}