import getEnvVars from '../environment';
const { KAKAO_API_KEY } = getEnvVars();

export const translate = async (word) => {
  const encodedWord = encodeURI(word);
  const url = `https://dapi.kakao.com/v2/translation/translate?query=${encodedWord}&src_lang=kr&target_lang=en`;
  const result = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      Accept: '*/*',
    }
  }).then((res) => res.json());

  return result['translated_text'][0][0];
};
