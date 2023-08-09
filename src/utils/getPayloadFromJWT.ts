export default function getPayloadFromJWT(jwt: string | null) {
  // jwt가 없으면 payload도 없는거니깐 undefined return
  if (!jwt) {
    return undefined;
  }
  // payload부분 base64 decoding하는 로직, jwt관련 외부 라이브러리 사용할 필요 없음
  const payload = jwt.split('.')[1];
  const base64 = payload.replace(/_/g, '/').replace(/-/g, '+');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const decodedPayload = atob(base64 + padding);
  const payloadObject = JSON.parse(decodedPayload);
  return payloadObject;
}
