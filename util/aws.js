import { translate } from './kakao';
import getEnvVars from '../environment';

const { SERVER_URI } = getEnvVars();

export const compareLabels = async ({ keyword, data }) => {
  if (typeof keyword !== 'string') throw Error(`${keyword} should be string`);
  const translated = await translate(keyword);

  return data.Labels.some((label) => (
    label.Name.toLowerCase() === translated.toLowerCase()
  ));
};

const post = async ({ path, body, options = {} }) => {
  try {
    const headers = {
      'content-type': 'application/json',
    };

    Object.keys(options).forEach((key) => {
      headers[key.toLowerCase()] = options[key];
    });

    const { data, errMessage, status } = await fetch(`${SERVER_URI}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then((result) => result.json());

    if (status >= 400) throw Error(errMessage);

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const detectLabels = async (datauri) => {
  return await post({ path: '/aws/rekognition', body: { datauri: 'data:image/jpeg;base64,' + datauri } });
};
