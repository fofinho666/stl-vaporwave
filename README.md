# STL Vaporwave
A drag and drop webapp to visualize STL in a cool way 😎
## Requirements

We have the following dependences to run this project:

- [Go](https://golang.org/) v1.16 or above
- [Node.js](https://golang.org/) v14 or above

A `.env` file is also required inside the **backend folder**. Here's an example of it:
```bash
AUTH_USERNAME="admin"
AUTH_PASSWORD="admin"
```
### Development

First we need to install it's dependencies. 
1. On the **frontend folder** run `npm i`
2. On the **backend folder** run `make install`
3. To run everything together with concurrently, on the root folder run `npm i`

To run the project in watch mode
- On the **frontend folder** run `npm run dev`
- On the **backend folder** run `make dev`
- To run everything together, on the root folder run `npm run dev`

### Building the project 

First, we need to build the latest frontend assets by running on the **frontend folder** `npm run buld`.

Now we can build the project binary. On the **backend folder** run `make build_all`. The binaries will be at `backend/bin/`.

If we want just the binary for the our current machine, we can run only `make build` insted.

**Note:** The binary will need the same `.env` file to run. Make sure that this is <ins>on the same directory were you are running the application</ins>.
