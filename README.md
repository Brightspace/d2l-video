# d2l-video

A Polymer video player component.

![Video player example image](example.png)

## Usage

* Ensure you have the correct .npmrc file in your project or home directory
* Run `npm install`
* Import and use the component:
```
import '@d2l/video/d2l-video.js';

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
* Visit http://localhost:9998/components/@d2l/video/demo/
