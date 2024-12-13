declare const FB: {
  login: (
    callback: (response: { authResponse?: { code?: string } }) => void,
    options: {
      config_id: string;
      response_type: string;
      override_default_response_type: boolean;
      extras: {
        setup: object;
        featureType: string;
        sessionInfoVersion: string;
      };
    }
  ) => void;
};
