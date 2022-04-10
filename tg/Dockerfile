FROM python:3.10-slim

# System deps
RUN apt-get update && apt-get install -y -qq git gcc
# Download and install poetry
RUN pip install poetry

# Copy Poetry's files
WORKDIR /code
COPY tg/poetry.lock tg/pyproject.toml /code/tg/

ADD client /code/client

# Install deps
RUN cd tg && poetry config virtualenvs.create false
RUN poetry install --no-dev --no-interaction

# Copy sources
COPY ./tg /code/tg