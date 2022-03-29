# syghtings server

Syghtings server is the main backend service for syghtings app, it is suposed that will be subscripted to a message queue and it will stores in the database the message data received from syghtings client app 

## Dependencies

`npm install`

## Running

`npm run dev`<br>
`npm start`

## Docker

`docker-compose up -d` <br>
`docker-compose down`

## Testing

`http://localhost:3000/healthcheck`


## kubernetes

navigate k8s folder:

`minikube start` <br>
`kubectl apply -f syghtings-server.yml`
`kubectl apply -f ingress.yml`
`kubectl describe ingress syghtings-server-ingress`

navigate address property on the browser
## Licence

nothing yet