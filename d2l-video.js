/**
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import '@brightspace-ui/core/components/typography/typography.js';
import '@d2l/media-behavior/d2l-media-behavior.js';
import '@d2l/seek-bar/d2l-seek-bar.js';
import 'fullscreen-api/fullscreen-api.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-video">
	<template strip-whitespace="">
		<style is="custom-style" include="iron-flex iron-flex-alignment">
			:host {
				display: inline-block;
				position: relative;
				outline: 0;
			}

			#container {
				width: 100%;
				height: 100%;
				background-color: black;
				max-width: inherit;
				max-height: inherit;
			}

			fullscreen-api[fullscreen] + #container {
				max-height: none;
				max-width: none;
			}

			#media {
				display: block;
				width: 100%;
				min-width: 100%;
				max-width: inherit;
				max-height: inherit;
			}

			#fsApi[fullscreen] ~ #container > #media {
				min-height: 100%;
				height: 100%;
			}

			#controlBar {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 50px;
				background-color: rgba(0, 0, 0, 0.6);
				box-sizing: border-box;
				padding: 0 10px;
				width: 100%;
			}

			#controlBar .control {
				margin: 10px 10px;
				border-radius: 4px;
			}

			.control:hover,
			.control:hover d2l-icon,
			.control:hover .d2l-body-compact {
				color: black;
				background: var(--d2l-color-regolith);
			}

			.control:focus,
			.control:focus d2l-icon {
				background: var(--d2l-color-regolith);
				outline: 2px solid var(--d2l-color-celestine);
				color: black;
			}


			#controlBar .time-control {
				margin: 0 5px;
			}

			#controlBar .seek-control {
				margin: 0 10px;
			}

			.control-icon {
				display: inline-block;
			}

			d2l-icon {
				color: var(--d2l-color-white);
				padding: 2px;
			}

			d2l-icon[hidden] {
				display: none;
			}

			#seekBar {
				--d2l-knob-size: 24px;
				--d2l-inner-knob-margin: 6px;
			}

			#volumeBar {
				--d2l-knob-size: 18px;
				--d2l-inner-knob-color: var(--d2l-color-regolith);
				--d2l-knob-box-shadow: 1px 1px 0 0 rgba(0, 0, 0, 0.4);
			}

			.time-control {
				color: var(--d2l-color-white);
			}

			.volume-control-container {
				z-index: 1;
				padding: 5px 20px 5px 40px;
				position: absolute;
				bottom: 69px;
				left: -87px;
				transform: rotate(-90deg);
			}

			.volume-control {
				background-color: rgba(0, 0, 0, 0.6);
				border-radius: 0 8px 8px 0;
				width: 120px;
				padding: 12px 6px;
			}

			.playback-speed-control-container {
				z-index: 1;
				position: absolute;
				bottom: 100%;
				left: -100%;
			}

			.playback-speed-control {
				color: var(--d2l-color-white);
				background-color: rgba(0, 0, 0, 0.6);
				border-radius: 8px;
				width: 60px;
				padding: 12px 6px;
				text-align: center;
				transform: translateX(72%);
			}

			.playback-speed-control button {
				color: var(--d2l-color-white);
				width: 100%;
				padding: 5px 0;
				display: block;
				border-bottom: 1px solid rgba(255, 255, 255, 0.2);
			}

			.playback-speed-control button:last-child {
				border-bottom: none;
			}

			.playback-speed-control button[active],
			.playback-speed-control button:hover,
			.playback-speed-control button:focus {
				background: var(--d2l-color-white);
				color: black;
			}

			.playback-speed-container .d2l-body-compact {
				color: var(--d2l-color-white);
				width: 30px;
				text-align: left;
				margin-left: 5px;
				display: inline-block;
			}

			button {
				cursor: pointer;
				margin: 0;
				padding: 2px;
				background: none;
				border: none;
			}

			.volume-container {
				position: relative;
			}

			.playback-speed-container {
				position: relative;
			}

			.message-overlay {
				color: var(--d2l-color-white);
				width: 100%;
				height: 100%;
				display: flex;
				position: absolute;
				top: 0;
				align-items: center;
				text-align: center;
			}
			.message-overlay p {
				width: 100%;
			}
		</style>

		<fullscreen-api id="fsApi" target="{{ _getFsTarget() }}" fullscreen="{{ isFullscreen }}"></fullscreen-api>

		<div id="container" on-tap="_onContainerTap">
			<video id="media" controls$="{{ _isMobileSafari() }}" preload="{{ _getPreload(autoLoad) }}" poster="{{ poster }}" on-tap="_onVideoTap" autoplay="{{ _getAutoplay(autoplay) }}" aria-label$="[[localize('EvidenceVideoPlayer')]]"></video>
			<div id="controlBar" hidden$="{{ _isMobileSafari() }}" class="layout horizontal center d2l-typography">
				<div class="control play-pause-container">
					<button hidden$="{{ isPlaying }}" on-tap="_playPause" aria-label$="[[localize('Play')]]"><d2l-icon icon="d2l-tier3:play"></d2l-icon></button>
					<button hidden$="{{ !isPlaying }}" on-tap="_playPause" aria-label$="[[localize('Pause')]]"><d2l-icon icon="d2l-tier3:pause"></d2l-icon></button>
				</div>
				<div class="control volume-container" on-mouseover="_showVolumeControlByHover" on-mouseout="_hideVolumeControlByHover">
					<button aria-label$="[[localize('Volume')]]" on-focus="_showVolumeControlByHover" on-tap="_toggleVolumeControl"><d2l-icon class="control-icon" icon="d2l-tier1:volume"></d2l-icon></button>
					<template is="dom-if" if="{{ volumeControlVisible }}">
						<div class="volume-control-container" on-mouseover="_showVolumeControlByHover" on-mouseout="_hideVolumeControlByHover" >
							<div class="volume-control" on-tap="_onVolumeControlTap">
								<d2l-seek-bar id="volumeBar" value="40" immediate-value="{{ rawVolume }}" vertical="" aria-label$="[[localize('VolumeBar')]]"></d2l-seek-bar>
								<d2l-offscreen aria-live="assertive">[[localize('VolumeLevel', 'rawVolume', rawVolume)]]</d2l-offscreen>
							</div>
						</div>
					</template>
				</div>
				<div class="control playback-speed-container" on-mouseover="_showPlaybackSpeedControlByHover" on-mouseout="_hidePlaybackSpeedControlByHover">
					<button aria-label$="[[localize('PlaybackSpeed')]]" on-focus="_showPlaybackSpeedControlByHover" on-tap="_togglePlaybackSpeedControl">
						<d2l-icon class="control-icon" icon="d2l-tier1:time"></d2l-icon>
						<div class="playback-speed d2l-body-compact">{{ playbackSpeed }}x</div>
					</button>
					<template is="dom-if" if="{{ playbackSpeedControlVisible }}" id="playback-controls">
						<div class="playback-speed-control-container" on-mouseover="_showPlaybackSpeedControlByHover" on-mouseout="_hidePlaybackSpeedControlByHover" >
							<div class="playback-speed-control">
								<button on-tap="_onPlaybackSpeedControlChanged" value="0.25">0.25</button>
								<button on-tap="_onPlaybackSpeedControlChanged" value="0.5">0.5</button>
								<button on-tap="_onPlaybackSpeedControlChanged" value="1">Normal</button>
								<button on-tap="_onPlaybackSpeedControlChanged" value="1.25">1.25</button>
								<button on-tap="_onPlaybackSpeedControlChanged" value="1.5">1.5</button>
								<button on-tap="_onPlaybackSpeedControlChanged" value="2">2</button>
							</div>
						</div>
					</template>
				</div>
				<div class="layout horizontal center flex time-container" dir="ltr">
					<div class="time-control time-control-left d2l-body-compact">{{ _formatTime(currentTime) }}</div>
					<div class="flex seek-control">
						<d2l-seek-bar id="seekBar" value="[[ percentComplete ]]" immediate-value="{{ immediateValue }}" aria-label$="[[localize('SeekBar')]]" on-drag-start="_onSeekStart" on-drag-end="_onSeekEnd" on-position-change="_onPositionChange"></d2l-seek-bar>
					</div>
					<div class="time-control time-control-right d2l-body-compact">{{ _formatTime(duration) }}</div>
				</div>
				<div class="expand control">
					<button aria-label$="[[localize('Fullscreen')]]" on-tap="_toggleFullscreen"><d2l-icon class="control-icon" icon="[[ _getFullscreenIcon(isFullscreen) ]]"></d2l-icon></button>
				</div>
			</div>
			<template is="dom-if" if="{{ !_isMediaReady(mediaStatus) }}">
				<div id="message" class="message-overlay">
					<p>{{ processingMessage }}</p>
				</div>
			</template>
		</div>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
window.D2L = window.D2L || {};
window.D2L.MediaBehavior = window.D2L.MediaBehavior || window.D2LMediaBehavior;
Polymer({
	is: 'd2l-video',

	behaviors: [
		window.D2L.MediaBehavior,
		IronA11yKeysBehavior,
		D2L.PolymerBehaviors.D2LVideo.LocalizeBehavior
	],

	properties: {
		poster: String,
		processingMessage: {
			type: String
		},
		rawVolume: {
			type: Number,
			observer: '_rawVolumeChanged'
		},
		_currentPlaybackSpeedItem: {
			type: Node,
			value: null,
		},
		playbackSpeed: {
			type: Number,
			value: 1,
		},
		volumeControlVisible: {
			type: Boolean,
			value: false
		},
		playbackSpeedControlVisible: {
			type: Boolean,
			value: false
		}
	},

	hostAttributes: {
		tabindex: 0
	},

	keyBindings: {
		'space': '_playPause',
		'f': '_toggleFullscreen'
	},

	_onContainerTap: function() {
		if (this.volumeControlVisible) {
			this.volumeControlVisible = false;
		}
	},

	_getFullscreenIcon: function(isFullscreen) {
		return isFullscreen ? 'd2l-tier1:smallscreen' : 'd2l-tier1:fullscreen';
	},

	_getFsTarget: function() {
		return this.$$('#container');
	},

	_onVideoTap: function() {
		this._playPause();
	},

	_onVolumeControlTap: function(e) {
		e.stopPropagation();
	},

	_onPlaybackSpeedControlChanged: function(e) {
		if(this._currentPlaybackSpeedItem) {
			this._currentPlaybackSpeedItem.removeAttribute('active')
		}

		this._currentPlaybackSpeedItem = e.target

		e.target.setAttribute('active', "");

		this.playbackSpeed = e.target.value;
		this.$.media.playbackRate = this.playbackSpeed;
		console.log(`Playback speed: ${e.target.value}`)
	},

	_activeSpeed: function(value) {
		return value === this.playbackSpeed
	},

	_rawVolumeChanged: function(rawVolume) {
		this.volume = rawVolume / 100;
	},

	_toggleFullscreen: function() {
		this.$.fsApi.toggleFullscreen();
	},

	_toggleVolumeControl: function(e) {
		e.stopPropagation();
		this.volumeControlVisible = !this.volumeControlVisible;
	},

	_togglePlaybackSpeedControl: function(e) {
		e.stopPropagation();
		this.playbackSpeedControlVisible = !this.playbackSpeedControlVisible;
	},

	_showVolumeControlByHover: function() {
		this.volumeControlVisible = true;
	},
	
	_hideVolumeControlByHover: function() {
		this.volumeControlVisible = false;
	},

	_showPlaybackSpeedControlByHover: function() {
		this.playbackSpeedControlVisible = true;
	},

	_hidePlaybackSpeedControlByHover: function() {
		this.playbackSpeedControlVisible = false;
	},

	_isMobileSafari: function() {
		// iOS Safari 3.0 - 9.1 from https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
		var ctr = /constructor/i.test(window.HTMLElement);
		var srn = (function(p) {
			return p.toString() === '[object SafariRemoteNotification]';
		})(!window.safari || (typeof window.safari !== 'undefined' && window.safari.pushNotification));

		// Apple Pay detection (added in iOS 10+) and exclusively for Safari
		var apy = window.ApplePaySession;

		// Mobile only
		var ua = /iP(ad|hone|od)/i.test(window.navigator && window.navigator.userAgent);

		return !!((ctr || srn || apy) && ua);
	},

	_isMediaReady: function(mediaStatus) {
		return mediaStatus === 'ready';
	}
});
