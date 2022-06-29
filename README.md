# 🐱 Winnie - WhatsApp AI Chatbot

## 🤖 AI Powered Chatbot using GPT-3

**_Chat on WhatsApp with an AI_**

## Demo


## 🔨 Tech Stack

**Server:** Node.JS, Express

**Database:** Redis

**API:** WhatsApp Business Cloud API, OpenAI GPT-3

**Deployment:** Docker, Nginx, Linode

**Misc:** ElasticSearch, Kibana

## ⚙️ Project Structure

**whatsapp-connector:** Whatsapp connector is a microservice which connects a bot to WhatsApp API, handles messaging and incoming requests from WhatsApp

**chatbot:** Chatbot is a microservice which will connect to OpenAI GPT-3 model to answer user queries based on prompt

## 🥣 Meta Configuration

Multiple prerequisites and configuration needs to be done on the Meta Developers, please follow my below guide for details:
**[https://blog.amitwani.dev/create-a-chatbot-using-whatsapp-cloud-api](https://blog.amitwani.dev/create-a-chatbot-using-whatsapp-cloud-api)**

## 🏃‍♂️ Running Application

- ### Run the application using `docker-compose`

  - **Update Environment Variables**

    - Fill necessary values in `docker-compose-local.yml` file inside `docker` folder for below environment variables:
      - `VERIFY_TOKEN` - Verify Token for WhatsApp Webhook
      - `OPENAI_API_KEY` - OpenAI API Key
      - `WHATSAPP_TOKEN` - WhatsApp Business Permanent/Temporary Authentication Token with `whatsapp_business_messaging` permission
      - `WHATSAPP_SEND_MESSAGE_API` - WhatsApp Cloud API Send Message API End Point with Phone Number ID
      - `CHATBOT_URL` - Chatbot microservice api url

  - Run command `docker-compose -f docker-compose.local.yml up -d` inside `docker` folder

- ### Run using `npm`

  - **Install Dependencies**

  Navigate to `whatsapp-connector` and `chatbot` to install their dependecies.

  ```bash
    npm install
  ```

  or

  ```bash
    yarn add
  ```

  - **Update Environment Variables**

    - Create `.env` file by copying `.env.sample` in both microservices
    - Fill necessary values for below environment variables:
      - `VERIFY_TOKEN` - Verify Token for WhatsApp Webhook
      - `OPENAI_API_KEY` - OpenAI API Key
      - `WHATSAPP_TOKEN` - WhatsApp Business Permanent/Temporary Authentication Token with `whatsapp_business_messaging` permission
      - `WHATSAPP_SEND_MESSAGE_API` - WhatsApp Cloud API Send Message API End Point with Phone Number ID
      - `CHATBOT_URL` - Chatbot microservice api url

  - **Run the Server**

  ```bash
      npm run start
  ```

## 🛳️ Deployment

Deploy with Docker easily using the `Dockerfile` provided in the respective services folder or the `docker-compose.yml` in the `docker` folder

## 👷 CI/CD

GitHub Actions is used to create a CI/CD workflow specified in the `workflow.yml`. 

### Workflow

- On every commit on `main` branch
- Build Docker Images of both microservices
- Push Docker Images of both microservices to docker repository
- Update `docker-compose.yml` by replacing environment varibles from GitHub secrets
- Copying `docker-compose.yml` and `nginx.conf` to the server
- Running `docker-compose` command to recreate containers
- Deployment is done 

## Acknowledgements

- [Linode](https://linode.com)
- [Hashnode](https://hashnode.com)

## Feedback

If you have any feedback, please reach out to me at mtwn105@gmail.com
