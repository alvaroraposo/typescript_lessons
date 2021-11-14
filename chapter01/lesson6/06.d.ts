/* 
TypeScript supports type
declaration files that end with .d.ts
Here, you can add all
your custom types, but no extra program code.
To make our types available, we have to export them
*/
export type StorageItem = {
  weight: number;
};

export type ShipStorage = {
  max: number;
  items: StorageItem[];
};

/*To make globals known and defined, we can use ambient
type declarations. These types are encompassing, existing
and present on all sides.*/
export declare const isDevelopment: boolean;
