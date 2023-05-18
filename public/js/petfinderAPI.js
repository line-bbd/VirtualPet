let params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('client_id', 'NLXT7lOmTd7jPfJNx1W5pzAhETraAzSCQiAuwN5hsbbQJVhU4w');
params.append('client_secret', 'FOiIjVrCHVf7dopm27ijFBuy9jCSReLbpDAsaMqH');

class petfinderAPI{

  async getToken(){
    
    const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'POST',
        body: params,
        headers: {
          'Connection': 'keep-alive'
        }
      });
      const myJson = response.json();
      return myJson;
  } 


  async getDog(seenExtPetId,page)
  {
    let allDogs,dogsInDB,foundDogs,retDog;
    dogsInDB = [];//TODO: Get all external ids of dogs in our db

    let dogFound = false;
    while(!dogFound)
    {
      allDogs = await this.getAllDogsByPage(page);
      foundDogs = this.filterDogs(seenExtPetId,dogsInDB,allDogs);

      if(foundDogs.length == 0){
        page = page + 1;
      }
      else{
        retDog = foundDogs[0];
        dogFound = true;
      }
    }

    return retDog;
  }

  async getAllDogsByPage(page){

    let results = await this.getToken();
    let req = `https://api.petfinder.com/v2/animals?type=Dog&status=adoptable&limit=100&page=${page}`;
    const response = await fetch(req, {
    method: 'GET',
    headers: {
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${results.access_token}`
    }
    });
    const allDogs = await response.json();

    return allDogs;
  }

  //Finds the first dog, that 
  // 1) Has at least 1 picture
  // 2) Has at least 1 trait
  // 3) Has not been seen by this specific user before
  // 4) Has not been 'adopted' by a user in our db before
  filterDogs(seenExtPetId,dogsInDB,allDogs)
  {
    let foundDogs = allDogs['animals'].filter(dog => dog.photos.length > 0 
      && dog.tags.length > 0
      && !seenExtPetId.includes(dog.id)
      && !dogsInDB.includes(dog.id)
    );
    return foundDogs;
  }

  getAnimalByID = async (id) => {
      getToken().then(async results => {
          const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
          method: 'GET',
          headers: {
              'Connection': 'keep-alive',
              'Authorization': `Bearer ${results.access_token}`
          }
          });
          const myJson = await response.json();
          return myJson;
        })
        .catch(error => {
          console.log(error);
        });
  }
}

module.exports = petfinderAPI;

