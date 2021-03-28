FROM python:3.9.0-alpine3.12


# System deps:
RUN apk add build-base curl git libffi-dev
RUN apk add openssl
RUN apk add libressl-dev musl-dev libffi-dev
RUN curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python
# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY poetry.lock pyproject.toml /code/

# Project initialization:
RUN /root/.poetry/bin/poetry config virtualenvs.create false \
  && /root/.poetry/bin/poetry install $(test "$PROD" == 1 && echo "--no-dev") --no-interaction

# Creating folders, and files for a project:
COPY . /code

CMD ["python", "main.py"]
