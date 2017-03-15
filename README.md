# d2l-video

A polymer video player component.

## Usage

* Install [bower-art-resolver](https://www.npmjs.com/package/bower-art-resolver).
* Create a `.bowerrc` file in your project:
```
{
	"registry": {
		"search": [
			"https://ro-dev:AP3hK9qVHxhdvdFwPeGMw2bj5eWeuDJZuRCdBB@d2lartifacts.artifactoryonline.com/d2lartifacts/api/bower/bower-local",
			"https://bower.herokuapp.com"
  		]
	},
	"resolvers": [
		"bower-art-resolver"
	]
}
```
* Install `d2l-video` with Bower.
* Run `npm install`
* Run `bower install`
* Import and use the component:
```
<link rel="import" href="path/to/bower_components/d2l-video/d2l-video.html">

...

<d2l-video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></d2l-video>
```

## Development

* `npm install`
* `npm start`
* Visit http://localhost:9998/components/d2l-video/demo/
