# TrustCoreID
For Human Dynamics open collaboration on CoreID project.  

## Check Out the Demo

Video of an initial walk through and discussion is available on the GitHub Pages site for this project, here: [https://mitmedialab.github.io/TrustCoreID](https://mitmedialab.github.io/TrustCoreID) 

## Learn More About the Project

More information about the scope and context of this project is available here: [https://github.com/mitmedialab/TrustCoreID/blob/master/docs/ProjectScopeAndContext.md](https://github.com/mitmedialab/TrustCoreID/blob/master/docs/ProjectScopeAndContext.md)  


# Thanks and Attributions

<img width="801" alt="screen shot 2017-06-27 at 4 16 10 pm" src="https://user-images.githubusercontent.com/2357755/27608080-1e7c4992-5b54-11e7-9b0b-c0cebf699c8b.png">

# Preparing dev environment

Setup:

```
npm install
npm rebuild
cd app
npm install
npm run rebuild
```

create `.env` file in application folder with following properties:
```
HOST=localhost
PORT=5150
COUCH_URL=http://couch-domain:5984
COUCH_USERNAME=username
COUCH_PASSWORD=password
```


Start server (execute from project root)
```
node server/server.js
```

Start client (execute from project root)
```
npm run dev
```



