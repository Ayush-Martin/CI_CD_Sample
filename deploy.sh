ssh -o StrictHostKeyChecking=no -i ~/.ssh/deploy_key "$EC2_USER@$EC2_HOST" << 'ENDSSH'
  mkdir -p ~/ci-cd-app
  cd ~/ci-cd-app

  cat <<EOF > .env
APP_NAME=$APP_NAME
PORT=$PORT
REDIS_URL=$REDIS_URL
EOF

  docker pull ayushmartin/ci_cd_sample:latest
  docker stop ci_cd_sample || true && docker rm ci_cd_sample || true
  docker-compose -f docker-compose.prod.yml up -d
ENDSSH
