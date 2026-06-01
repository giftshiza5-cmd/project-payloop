const pinataSDK = require("@pinata/sdk");

const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT,
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

async function uploadJsonToIpfs(payload) {
  const result = await pinata.pinJSONToIPFS(payload, {
    pinataMetadata: {
      name: `payloop-receipt-${Date.now()}`,
    },
  });

  return {
    ipfsHash: result.IpfsHash,
    pinSize: result.PinSize,
    timestamp: result.Timestamp,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
  };
}

module.exports = { uploadJsonToIpfs };
