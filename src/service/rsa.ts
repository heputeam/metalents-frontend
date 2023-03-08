import JsEncrypt from 'jsencrypt';

export const pub_key = `-----BEGIN RSA Public Key-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm7xTr3WrgaojCaySQMRq
FpBhxh5B4gZn0X80DmykF3UOrNNNq2/JtjJkJFDX0wqt1k2yjVecrMdVmh5BwpkJ
iZZaHItIMpJLsABkogXkR/Os8T25eZvLuopEYpVIt+6kLl5i1vmJtl/G8VueCd9U
JdMlcQDUJsYAIDCyI/uHkWC0ON2WUPM7IXuKkBqu8XL+oLFCuoMNtg7E5ofWyP5z
GiBZuqW4ORJkNMHnnQqpGq1z3Q5gNJU5fepFfjKPitjx2vSkooxNNSve7U2uA/Pp
GShrZcqTdJ+mu2A0fqqJq1uphU3Dugd2RNFz9vG/NBxWD9pNM0balNTgfGYwIhyJ
3wIDAQAB
-----END RSA Public Key-----`;

export const Encrypt = (value: string) => {
  const encrypt = new JsEncrypt();
  encrypt.setPublicKey(pub_key);
  return encrypt.encrypt(value);
};
