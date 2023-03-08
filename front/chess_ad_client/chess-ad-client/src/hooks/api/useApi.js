export function useApi () {
  const API = process.env.REACT_APP_API_BASE_URL;
  
  const requestApi = async requestInfo => {
    const { path = '', method = 'GET', body = {} } = requestInfo;
    
    try {
    const response = fetch(API + path, {
      method,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });
      const data = response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return [
    requestApi
  ];
} 