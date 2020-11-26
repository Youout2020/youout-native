import React from 'react';
import { WebView } from 'react-native-webview';
import getEnvVars from './environment';
const { WEB_VIEW_URI, USER_AGENT } = getEnvVars();

const WebViewComponent = ({ webviewRef, handleEndLoading, handleOnMessage }) => {
  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={webviewRef}
      source={{ uri: WEB_VIEW_URI }}
      userAgent={USER_AGENT}
    />
  );
};

export default WebViewComponent;
