# WhatsApp AI Chatbot

## AI Powered Chatbot using GPT-3

**_Chat on WhatsApp with an AI_**

## Demo

Link to chat with the live bot [https://wa.me/message/3LBEVE5J7IR3D1](https://wa.me/message/3LBEVE5J7IR3D1)

## Tech Stack

**Server:** Node.JS, Express

**API:** WhatsApp Business Cloud API, OpenAI GPT-3

## Installation

- **Install Dependencies**

```bash
  npm install
```

or

```bash
  yarn add
```

- **Update Environment Variables**

  - Create `.env` file by copying `.env.sample`
  - Fill necessary values
    `VERIFY_TOKEN`, `OPENAI_API_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_SEND_MESSAGE_API`

    - `VERIFY_TOKEN` - Verify Token for WhatsApp Webhook
    - `OPENAI_API_KEY` - OpenAI API Key
    - `WHATSAPP_TOKEN` - WhatsApp Business Permanent/Temporary Authentication Token with `whatsapp_business_messaging` permission
    - `WHATSAPP_SEND_MESSAGE_API` - WhatsApp Cloud API Send Message API End Point with Phone Number ID

- **Run the Server**

```bash
    npm run start
```

- **Deployment**

  Deploy with Docker easily using the `Dockerfile` provided or the `docker-compose.yml`

## Configuration

**Detailed Guide is available on my blog [here](https://blog.amitwani.dev)**

Multiple Prequisites and Configuration needs to be done.

### Prequisites

- A Meta developer account
- A Meta Business account

### Steps

- Create an app in Meta Developer Console
- Link the app and the Meta Business Account
- Add WhatsApp Integration to your app
- Add a Phone Number and Get the Phone Number ID
- Generate a Permanent Authentication Token from Meta Business Settings
- Configure the Webhook and Verify Token

## Acknowledgements

- [Linode](https://linode.com)
- [Hashnode](https://hashnode.com)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Feedback

If you have any feedback, please reach out to me at mtwn105@gmail.com
