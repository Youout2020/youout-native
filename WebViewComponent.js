import React from 'react';
import { WebView } from 'react-native-webview';

import { env } from './env';

const { USER_AGENT } = process.env;
const { REACT_APP_WEB_VIEW_URI } = env;

const WebViewComponent = ({ webviewRef, handleEndLoading, handleOnMessage }) => {
  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={webviewRef}
      source={{ uri: REACT_APP_WEB_VIEW_URI }}
      userAgent={USER_AGENT}
    />
  );
};

export default WebViewComponent;
