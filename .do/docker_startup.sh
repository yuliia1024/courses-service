#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

echo "Start server and run migration"
npx sequelize-cli db:seed:all
npm run start