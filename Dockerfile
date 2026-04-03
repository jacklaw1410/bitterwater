FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

RUN bun add -g vite-plus

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
RUN bun playwright install --with-deps

COPY . .

CMD ["vp", "run", "test:e2e", "-u"]
