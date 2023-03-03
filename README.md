# TestLeasingApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.

## Development API

API created use Docker container. To run api follow to the steps:
- The docker image can be pulled with the following command:
`docker pull walterallane/leasing-api:latest`
- The docker image can be started as follows:
`docker run -p 8081:8080 --name leasing-api -d walterallane/leasing-api:latest`
- After the container is up and running you could access the api over the swagger ui:
`http://localhost:8081/swagger-ui/index.html`
- The backend implementation is based on the OpenAPI specification which could be found here:
https://github.com/walter-allane/leasing-contract/blob/main/leasing.yaml

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## About project

In this project used Angular v13, Material UI, RxJs.

For show all contracts, customers and vehicle used table.

For detailed information and creat new contract, customer or vehicle used dialog.

