import { BASE_API_ENDPOINT } from "../Screens/services/api-request";

export const getConfig = () => {
  return {
    publicRuntimeConfig: {
      API_ENDPOINT: BASE_API_ENDPOINT,
    },
  };
};
