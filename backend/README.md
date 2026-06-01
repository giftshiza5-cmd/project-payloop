# PayLoop Backend

Node.js API for M-Pesa integration, push notifications, Firestore metadata, IPFS receipts, wallet auth, and the CircleVault blockchain bridge.

## Routes

- `GET /health` - service health check.
- `POST /api/auth/nonce` - creates a MetaMask login message for a wallet address.
- `POST /api/auth/verify` - verifies the signed message and returns a JWT.
- `GET /api/groups` - fetches Firestore group metadata.
- `GET /api/groups/:groupId` - fetches one group metadata record.
- `POST /api/groups` - stores group metadata.
- `POST /api/mpesa/stkpush` - starts a Safaricom Daraja STK Push.
- `POST /api/mpesa/callback` - receives M-Pesa confirmation and calls `CircleVault.contribute()`.
- `POST /api/notifications/send` - sends a Firebase Cloud Messaging push notification.
- `POST /api/ipfs/receipts` - pins a contribution receipt JSON payload to IPFS through Pinata.

Protected routes require `Authorization: Bearer <jwt>`.

## M-Pesa to Chain Flow

1. Mobile app signs in with MetaMask through `/api/auth/nonce` and `/api/auth/verify`.
2. Mobile app calls `POST /api/mpesa/stkpush` with `phoneNumber`, `amount`, `groupId`, and `contractGroupId`.
3. Daraja sends the STK prompt to the phone.
4. Safaricom posts the confirmation to `MPESA_CALLBACK_URL`.
5. The callback stores M-Pesa metadata in Firestore and calls `CircleVault.contribute(contractGroupId)` from the server wallet.
6. If a `notificationToken` was supplied, the backend sends a Firebase push notification with the chain transaction hash.

The server wallet must already be a member of the target CircleVault group because the current contract restricts `contribute()` to group members.

## Environment

Copy `.env.example` to `.env` and fill in Daraja, Firebase, Pinata, and chain credentials. `KES_TO_NATIVE_RATE` converts KES into the native chain token sent as `msg.value`, for example `0.000003` if KES 1 should map to `0.000003` native token.

For Railway or Render, add the same values as environment variables and set the start command to:

```bash
npm start
```
