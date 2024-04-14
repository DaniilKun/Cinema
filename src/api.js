export const fetchApi = async (url, errorMessage) => {
  console.log('url',url);
  console.log('process.env.API_TOKEN',process.env.API_TOKEN);
  try {
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': process.env.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error(errorMessage, error);
  }
};
