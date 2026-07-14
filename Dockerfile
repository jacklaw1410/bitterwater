FROM mcr.microsoft.com/playwright:v1.61.1-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV CI=true

CMD ["bun", "vp", "run", "test:e2e", "-u"]
