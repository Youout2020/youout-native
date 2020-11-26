import { translate } from './kakao';
import getEnvVars from '../environment';

const { SERVER_URI } = getEnvVars();

export const compareLabels = async ({ keyword, response }) => {
  if (typeof keyword !== 'string') throw Error(`${keyword} should be string`);
  const translated = await translate(keyword);

  return response.Labels.some((label) => (
    label.Name.toLowerCase() === translated.toLowerCase()
  ));
};

const post = async ({ path, body, options = {} }) => {
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
};

export const detectLabels = (datauri) => {
  return await post({ path: '/aws/rekognition', body: { datauri } });
};
