export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OTPVerification: { phoneNumber: string };
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  AI: undefined;
  Feed: undefined;
  Profile: undefined;
};

export type ServiceStackParamList = {
  AllServices: undefined;
  NICReissue: undefined;
  ComingSoon: { serviceName: string };
};

export type AIStackParamList = {
  AIChat: undefined;
  AIResults: { query: string };
};


