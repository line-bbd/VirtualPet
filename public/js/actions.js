// functions for each play action that will call the endpoint

const feed = () => {
  fetch("/play?feed=true");
};

const giveWater = () => {
  fetch("/play?water=true");
};

const giveAttention = () => {
  fetch("/play?attention=true");
};

const giveMedicine = () => {
  fetch("/play?medicine=true");
};

const bath = () => {
  fetch("/play?bath=true");
};

const giveTreat = () => {
  fetch("/play?treat=true");
};

const giveToy = () => {
  fetch("/play?toy=true");
};

const sleep = () => {
  fetch("/play?sleep=true");
};

// function to update the pet's stats (check if this works)
const updateStats = () => {
  fetch("/play")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("hunger").innerHTML = data.hunger;
      document.getElementById("thirst").innerHTML = data.thirst;
      document.getElementById("happiness").innerHTML = data.happiness;
      document.getElementById("health").innerHTML = data.health;
      document.getElementById("hygiene").innerHTML = data.hygiene;
      document.getElementById("energy").innerHTML = data.energy;
    });
};
