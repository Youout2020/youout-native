import Constants from 'expo-constants';

const ENV = {
  dev: {
    SERVER_URI: 'https://api.youout.site',
    KAKAO_API_KEY: '387f84c967a603562629f600f4f5da5e',
    WEB_VIEW_URI: 'https://www.youout.site',
    USER_AGENT: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36',
  },
  prod: {
    SERVER_URI: 'https://api.youout.site',
    KAKAO_API_KEY: '387f84c967a603562629f600f4f5da5e',
    WEB_VIEW_URI: 'https://www.youout.site',
    USER_AGENT: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36',
  }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;
