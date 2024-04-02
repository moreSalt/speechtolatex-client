# Speech-to-Latex Web Client

## Install
1. Clone the repo `git clone git@github.com:moreSalt/speechtolatex-client.git`
2. Change directory `cd speechtolatex-client`
3. Install dependencies `npm install`
4. Run in dev mode `npm run dev`

Note: Create and populate `.env` if using Open AI api key
```
PRIVATE_OPENAI_API_KEY="xxxx-xxxx-xxxx"
```

## Dependencies
- Node.js LTS (tested on 20.10.0)
- npm (tested on 10.2.3)


## TODO
- Right now all requests to the api are made from the client -> sveltekit server side -> python api, would be better if we could just do client -> python api. It's an issue with CORS on the python api side.
- Needs better defined types
- Needs better error handling
- Account page
- files/[slug] page should be able to save and render using cmd+S
- Need to add all of the non-content related Latex stuff, right now it's the most basic stuff
- File title editing
- Documentation and commenting

