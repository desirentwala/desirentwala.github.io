import { ProductFactory } from "./productfactory";

/** 
 * To load Country/Customer specific factory overwrite this file
*/

export class FactoryEntry {
    public static getFactoryEntry() {
        return ProductFactory;
    }
}