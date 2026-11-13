cd ./tweeter-shared
npm run build
cd ../tweeter-server
npm run build
Remove-Item -Path ".\layer\nodejs\node_modules" -Recurse -Force
Copy-Item -Path ".\node_modules" -Destination ".\layer\nodejs\" -Recurse -Force
sam delete --no-prompts
rimraf ./.aws-sam
sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset 
cd ..