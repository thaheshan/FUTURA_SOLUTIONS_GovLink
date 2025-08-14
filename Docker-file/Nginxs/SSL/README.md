# SSL Certificate Setup

## Production Setup
1. Obtain certificates from a Certificate Authority (CA)
2. Place files in this directory:
   - `fullchain.pem` - Certificate chain
   - `privkey.pem` - Private key
3. Update `nginx.conf` with correct paths

## Development Setup
Self-signed certificates are included for development:
- `localhost.crt` - Self-signed certificate
- `localhost.key` - Private key

To regenerate development certificates:
```bash
openssl req -x509 -newkey rsa:4096 -nodes \
  -out localhost.crt \
  -keyout localhost.key \
  -days 365 \
  -subj "/C=LK/ST=Western/CN=localhost"