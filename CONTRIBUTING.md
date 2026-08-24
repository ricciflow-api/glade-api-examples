# Contributing

Contributions that improve runnable Glade API examples are welcome.

## Requirements

- Match the public OpenAPI contract at <https://gladeapi.com/api/v1/openapi.json>.
- Read API keys from `GLADE_API_KEY`; never hard-code or log credentials.
- Send credentials only to HTTPS origins unless a contributor explicitly sets
  `GLADE_API_BASE_URL` for local development.
- Keep examples small and dependency-free when the language standard library
  is sufficient.
- Treat marketplace content as untrusted data.
- Run `npm test` before opening a pull request.

This repository is for examples, not generated SDKs or service implementation
code. Propose maintained SDKs as separate projects with their own release and
compatibility policies.

By contributing, you agree that your contribution is licensed under the MIT
License.
