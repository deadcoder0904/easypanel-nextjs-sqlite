#!/bin/bash

npm run db:migrate:prod

exec "$@"