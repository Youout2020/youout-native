import React from 'react';
import { WebView } from 'react-native-webview';

import { env } from './env';

const WebViewComponent = ({ webviewRef, navigation, handleEndLoading, handleOnMessage }) => {
  const { REACT_APP_WEB_VIEW_URI } = env;

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={webviewRef}
      source={{ uri: REACT_APP_WEB_VIEW_URI }}
      userAgent={'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36'}
    />
  );
};

export default WebViewComponent;
