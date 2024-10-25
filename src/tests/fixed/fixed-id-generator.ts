import { IIDGenerator } from "../../interfaces/id-generator.interface";

export class FixedIDGenerator implements IIDGenerator {
    generate(): string {
        return 'id-1'
    }
}