import { env } from '../env';

export const translate = async (word) => {
  const encodedWord = encodeURI(word);
  const url = `https://dapi.kakao.com/v2/translation/translate?query=${encodedWord}&src_lang=kr&target_lang=en`;
  const { REACT_APP_KAKAO_API_KEY } = env;
  const result = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `KakaoAK ${REACT_APP_KAKAO_API_KEY}`,
      Accept: '*/*',
    }
  }).then((res) => res.json());

  return result['translated_text'][0][0];
};
