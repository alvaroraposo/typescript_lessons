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
