export class Treasure {
  constructor(id, name, description, rarity, effect) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.rarity = rarity; // common, uncommon, rare, legendary
    this.effect = effect;
    this.discovered = false;
  }
} 