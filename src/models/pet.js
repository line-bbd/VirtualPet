class Pet {
  // constructor(name) {
  //   this.type = "Generic Pet";
  //   this.name = name;
  //   this.health = 100;
  //   this.happiness = 100;
  //   this.fed = 100;
  //   this.hygiene = 100;
  //   this.energy = 100;
  // }

  constructor(health,happiness,fed,hygiene,energy){
    this.health = health;
    this.happiness = happiness;
    this.fed = fed;
    this.hygiene = hygiene;
    this.energy = energy;
  }


  constructor(health,happiness,fed,hygiene,energy){
    this.health = health;
    this.happiness = happiness;
    this.fed = fed;
    this.hygiene = hygiene;
    this.energy = energy;
  }

  feed() {
    this.fed += 5;
    this.happiness += 5;
    this.energy += 5;
    this.message = "You fed your pet!";
  }

  giveAttention() {
    this.happiness += 5;
    this.energy -= 3;
    this.message = "You gave your pet attention!";
  }

  giveMedicine() {
    this.health += 5;
    this.happiness -= 3;
    this.energy -= 3;
    this.message = "You gave your pet medicine!";
  }

  giveBath() {
    this.hygiene += 5;
    this.happiness += 5;
    this.energy -= 3;
    this.message = "You gave your pet a bath!";
  }

  // giveTreat() {
  //   this.happiness += 5;
  //   this.hunger += 2;
  //   this.energy -= 3;
  //   this.message = "You gave your pet a treat!";
  // }

  // giveToy() {
  //   this.happiness += 5;
  //   this.energy -= 3;
  //   this.message = "You gave your pet a toy!";
  // }

  // sleep() {
  //   this.energy += 20;
  //   this.happiness += 10;
  //   this.hunger -= 5;
  //   this.message = "You put your pet to bed!";
  // }
}

module.exports = Pet;
