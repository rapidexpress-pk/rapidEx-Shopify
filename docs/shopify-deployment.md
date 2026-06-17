# Shopify App Deployment

This project is deployed as a public Shopify app that runs on its own VPS/container and syncs installed stores into the RapidEx backend.

## Runtime model

- Shopify hosts the merchant install entrypoint and admin surface.
- Your VPS hosts the Shopify app container at `https://shopify.rapidexpress.pk`.
- The app syncs install data to the Laravel backend after auth.

## Docker

Build the image:

```bash
docker build -t rapidex-shopify:latest .
```

Run with Compose:

```bash
docker compose --env-file deploy.env -f docker-compose.shopify.yml up -d
```

The container expects these env vars in `shopify.env`:

- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_APP_URL=https://shopify.rapidexpress.pk`
- `SCOPES`
- `SHOPIFY_BACKEND_API_URL`
- `SHOPIFY_BACKEND_SYNC_SECRET`

## Jenkins

The included `Jenkinsfile`:

- builds the image
- SSHes into the VPS
- updates `SHOPIFY_TAG` in `/var/www/rapidexpress/deploy.env`
- redeploys the `shopify` service in `/var/www/rapidexpress/docker-compose.app.yml`

Make sure `/var/www/rapidexpress/deploy.env` exists on the server before the pipeline runs.
Keep `shopify.env` next to the repo on the server or inject it as a Jenkins secret file.
Set `DEPLOY_HOST` and `DEPLOY_USER` as Jenkins build parameters when starting the job.

## DNS

Create DNS for the subdomain:

- Type: `A`
- Name/Host: `shopify`
- Value: your VPS public IP
- TTL: default

If you use IPv6, add an `AAAA` record too.

## Reverse proxy

Your proxy or ingress should route `shopify.rapidexpress.pk` to the Shopify app container on port `3000`.

If you use Nginx, the upstream should point to the container service name on the shared Docker network.

If you want to run the Shopify app alongside your existing RapidEx stack, add a service like this to the shared `docker-compose.app.yml` on the deployment host:

```yaml
  shopify:
    image: rapidex-shopify:${SHOPIFY_TAG}
    env_file: shopify.env
    restart: unless-stopped
    networks:
      - rapidex-network
```

## Shopify dashboard

In the Shopify app config, set:

- App URL: `https://shopify.rapidexpress.pk`
- OAuth redirect URL: `https://shopify.rapidexpress.pk/api/auth`

If you change app config for production, deploy the config through Shopify CLI or the Dev Dashboard.

Because this is a new repository, link it to the correct Shopify app record first:

```bash
npm run config:link
```

Then confirm the generated `client_id` and app settings in `shopify.app.toml` belong to the new Shopify app, not the old repo.
