# d2l-video

A Polymer video player component.

![Video player example image](example.png)

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

## Properties

`src (String)`: Video URL or URL where the video URL can be requested (see `requestSrc`).

`auto-load (Boolean)`: If set, the video is loaded immediately when the component is loaded (or the `src` changes). Otherwise, the video is loaded when the play button is pressed.

`autoplay (Boolean)`: If set, the video is played immediately when the component is loaded.

`poster (String)`: URL to the poster image.

`request-src (Boolean)`: If set, the video URL is requested from the `src` URL. The response to this request must be *JSON* in the following format:

```
{
	url: '<Video URL>'
}
```

This is useful when auto-load is not set, for supporting signed video URLs that may expire prior to the play button being pressed.

## Development

* `npm install`
* `npm start`
* Visit http://localhost:9998/components/d2l-video/demo/
