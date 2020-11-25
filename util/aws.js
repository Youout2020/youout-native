window.Buffer = window.Buffer || require('buffer').Buffer;

import { env } from '../env';
import { translate } from './kakao';

const AWS = require('aws-sdk');
const config = new AWS.Config({
  accessKeyId: env.REACT_APP_AWS_accessKeyId,
  secretAccessKey: env.REACT_APP_AWS_secretAccessKey,
  region: 'ap-northeast-2',
});
const client = new AWS.Rekognition(config);

export const compareLabels = async ({ keyword, response }) => {
  if (typeof keyword !== 'string') throw Error(`${keyword} should be string`);
  const translated = await translate(keyword);

  return response.Labels.some((label) => (
    label.Name.toLowerCase() === translated.toLowerCase()
  ));
};

export const detectLabels = (datauri) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(datauri, 'base64');
    const params = {
      Image: {
        Bytes: buffer
      },
      MaxLabels: 10,
      MinConfidence: 70,
    };

    client.detectLabels(params, function (err, response) {
      if (err) return reject(err);
      console.log(response);
      resolve(response);
    });
  });
};
