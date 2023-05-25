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

  constructor(pet_id,name,health,happiness,fed,hygiene,energy){
    this.pet_id = pet_id;
    this.name = name;
    this.health = health;
    this.happiness = happiness;
    this.fed = fed;
    this.hygiene = hygiene;
    this.energy = energy;
  }

  feed() {
    this.fed = Math.min(this.fed+5,100);
    this.happiness = Math.min(this.happiness+5,100);
    this.energy = Math.min(this.energy+5,100);
    this.message = "You fed your pet!";
  }

  giveAttention() {
    this.happiness = Math.min(this.happiness+5,100);
    this.energy = Math.max(this.energy-3,0);
    this.message = "You gave your pet attention!";
  }

  giveMedicine() {
    this.health = Math.min(this.health+5,100);
    this.happiness = Math.max(this.happiness-3,0);
    this.energy = Math.max(this.energy-3,0);
    this.message = "You gave your pet medicine!";
  }

  giveBath() {
    this.hygiene = Math.min(this.hygiene+5,100);
    this.happiness = Math.max(this.happiness-3,0);
    this.energy = Math.max(this.energy-3,0);
    this.message = "You gave your pet a bath!";
  }

  getRandomValue(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  updatePetStatsRandomly()
  {
    let min = 0;
    let max = 5;
    this.health = Math.max(this.health-this.getRandomValue(min,max),0);
    this.happiness = Math.max(this.happiness-this.getRandomValue(min,max),0);
    this.fed = Math.max(this.fed-this.getRandomValue(min,max),0);
    this.hygiene = Math.max(this.hygiene-this.getRandomValue(min,max),0);
    this.energy = Math.max(this.energy-this.getRandomValue(min,max),0);


  }

  setPetStats(data){
    this.health = data.health,
    this.happiness = data.happiness,
    this.fed = data.fed,
    this.hygiene = data.hygiene,
    this.energy = data.energy
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
  //   this.happiness += max;
  //   this.hunger -= 5;
  //   this.message = "You put your pet to bed!";
  // }
}

module.exports = Pet;
