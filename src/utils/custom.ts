const LOCAL_SERVER_URL = '/api/videosdk'

export const getToken = async () => {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/get-token`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const { token } = (await response.json()).data;
    return token;
  } catch (e) {
    console.log(e);
  }
};

export const createMeeting = async (token: string) => {
  try {
    const VIDEOSDK_API_ENDPOINT = `${LOCAL_SERVER_URL}/create-meeting`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    };
    const response = await fetch(VIDEOSDK_API_ENDPOINT, options)
      .then(async (result) => {
        const { roomId } = (await result.json()).data;
        return roomId;
      })
      .catch((error) => console.log("error", error));
    return response;
  } catch (e) {
    console.log(e);
  }
};

/** This API is for validate the meeting id  */
/** Not require to call this API after create meeting API  */
export const validateMeeting = async (token: string, roomId: string) => {
  try {
    const VIDEOSDK_API_ENDPOINT = `${LOCAL_SERVER_URL}/validate-meeting/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, roomId }),
    };
    const response = await fetch(VIDEOSDK_API_ENDPOINT, options)
      .then(async (result) => {
        const { valid } = (await result.json()).data;
        return valid;
      })
      .catch((error) => console.log("error", error));
    return response;
  } catch (e) {
    console.log(e);
  }
};