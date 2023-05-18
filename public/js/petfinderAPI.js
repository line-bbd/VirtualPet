let params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('client_id', 'NLXT7lOmTd7jPfJNx1W5pzAhETraAzSCQiAuwN5hsbbQJVhU4w');
params.append('client_secret', 'FOiIjVrCHVf7dopm27ijFBuy9jCSReLbpDAsaMqH');

const getToken = async () => {
    const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      body: params,
      headers: {
        'Connection': 'keep-alive'
      }
    });
    const myJson = await response.json();
    return myJson;
}


getToken().then(async results => {
    const response = await fetch('https://api.petfinder.com/v2/animals?type=Dog&status=adoptable&limit=100&page=1', {
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

export const getAnimalByID = async (id) => {
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

