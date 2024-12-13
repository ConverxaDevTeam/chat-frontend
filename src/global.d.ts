interface FacebookSDK {
  init: (config: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }) => void;
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options?: { scope: string }
  ) => void;
  getLoginStatus: (callback: (response: FacebookLoginResponse) => void) => void;
}

interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

interface FacebookLoginResponse {
  authResponse: FacebookAuthResponse | null;
  status: string;
}

declare global {
  interface Window {
    FB: FacebookSDK;
  }
}

export {};
