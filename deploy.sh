cd ./tweeter-shared
npm run build
cd ../tweeter-server
npm run build
cp ./node-modules ./layer/nodejs/
sam delete
sam build
sam deploy
y
