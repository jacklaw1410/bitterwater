FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

COPY package.json bun.lock ./
RUN bun install
RUN bun playwright install --with-deps

COPY . .

CMD ["bun", "test:e2e", "-u"]
