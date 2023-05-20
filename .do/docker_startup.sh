#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

echo "Start server and run migration"
npm run start