class petfinderAPI {
  constructor() {
    this.params = new URLSearchParams();
    this.initParams();
  }

  async initParams() {
    this.params.append("grant_type", "client_credentials");

    this.params.append("client_id", process.env.PETFINDER_CLIENT_ID);

    this.params.append("client_secret", process.env.PETFINDER_CLIENT_SECRET);
  }

  async getToken() {
    const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
      method: "POST",
      body: this.params,
      headers: {},
    });
    const myJson = response.json();
    return myJson;
  }

  async getDog(seenExtPetId, adoptedDogs, page) {
    let allDogs, foundDogs, retDog;

    let dogFound = false;
    while (!dogFound) {
      allDogs = await this.getAllDogsByPage(page);
      console.log(allDogs);
      foundDogs = this.filterDogs(seenExtPetId, adoptedDogs,allDogs);

      if (foundDogs.length == 0) {
        page = page + 1;
      } else {
        retDog = foundDogs[0];
        dogFound = true;
      }
    }

    return retDog;
  }

  async getAllDogsByPage(page) {
    let results = await this.getToken();
    let req = `https://api.petfinder.com/v2/animals?type=Dog&status=adoptable&limit=100&page=${page}`;
    const response = await fetch(req, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${results.access_token}`,
      },
    });
    const allDogs = await response.json();

    return allDogs;
  }

  //Finds the first dog, that
  // 1) Has at least 1 picture
  // 2) Has at least 1 trait
  // 3) Has not been seen by this specific user before
  // 4) Dogs not adopted before
  filterDogs(seenExtPetId,adoptedDogs, allDogs) {
    let foundDogs = allDogs["animals"].filter(
      (dog) =>
        dog.photos.length > 0 &&
        dog.tags.length > 0 &&
        !seenExtPetId.includes(dog.id) &&
        !adoptedDogs.includes(dog.id)
    );
    return foundDogs;
  }

  getAnimalByID = async (id) => {
    getToken()
      .then(async (results) => {
        const response = await fetch(
          `https://api.petfinder.com/v2/animals/${id}`,
          {
            method: "GET",
            headers: {
              Connection: "keep-alive",
              Authorization: `Bearer ${results.access_token}`,
            },
          }
        );
        const myJson = await response.json();
        return myJson;
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

module.exports = petfinderAPI;
