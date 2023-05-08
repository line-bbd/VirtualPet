class Pet {
  constructor(name) {
    this.name = name;
    this.hunger = 100;
    this.happiness = 100;
    this.health = 100;
    this.money = 100;
    this.message = "You have a new pet!";
  }

  feed() {
    this.hunger += 10;
    this.happiness += 10;
    this.health += 10;
    this.money -= 10;
    this.message = "You fed your pet!";
  }

  play() {
    this.hunger -= 10;
    this.happiness += 10;
    this.health += 10;
    this.money -= 10;
    this.message = "You played with your pet!";
  }
}

module.exports = Pet;
