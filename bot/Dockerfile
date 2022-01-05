FROM python:3.10-slim

# System deps
RUN apt-get update && apt-get install -y -qq git gcc
# Download and install poetry
RUN pip install poetry

# Copy Poetry's files
WORKDIR /code
COPY bot/poetry.lock bot/pyproject.toml /code/bot/

ADD client /code/client

# Install deps
RUN cd bot && poetry config virtualenvs.create false \
 && poetry install --no-dev --no-interaction

# Copy sources
COPY ./bot /code/bot