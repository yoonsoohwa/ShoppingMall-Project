const crypto = require("crypto");

function encrypt(data) {
  const cipher = crypto.createCipheriv(
    process.env.CRYPTO_ALGO,
    process.env.CRYPTO_SECRET,
    process.env.CRYPTO_IV
  );
  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return { encryptedData, authTag };
}

function decrypt(encryptedData, authTag) {
  const decipher = crypto.createDecipheriv(
    process.env.CRYPTO_ALGO,
    process.env.CRYPTO_SECRET,
    process.env.CRYPTO_IV
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, "hex")),
    decipher.final(),
  ]);

  return decryptedData.toString("utf-8");
}

module.exports = {
  encrypt,
  decrypt,
};
