import { v4 as uuid4 } from "uuid";
import { IIDGenerator } from "../../interfaces/id-generator.interface";

export class RandomIDGenerator implements IIDGenerator {
    generate(): string {
        return uuid4()
    }
}