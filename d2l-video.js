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
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-icons/tier3-icons.js';
import '@d2l/media-behavior/d2l-media-behavior.js';
import '@d2l/seek-bar/d2l-seek-bar.js';
import 'd2l-typography/d2l-typography.js';
import 'fullscreen-api/fullscreen-api.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-video">
	<template strip-whitespace="">
		<style is="custom-style" include="iron-flex iron-flex-alignment d2l-typography">
			:host {
				display: inline-block;
				position: relative;
				outline: 0;
			}

			#container {
				width: 100%;
				height: 100%;
				background-color: Black;
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
			}

			#controlBar .time-control {
				margin: 0 5px;
			}

			#controlBar .seek-control {
				margin: 0 10px;
			}

			.control-icon {
				display: block;
			}

			d2l-icon {
				color: White;
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
				bottom: 64px;
				left: -87px;
				transform: rotate(-90deg);
			}

			.volume-control {
				background-color: rgba(0, 0, 0, 0.6);
				border-radius: 0 8px 8px 0;
				width: 120px;
				padding: 12px 6px;
			}

			button {
				cursor: pointer;
				margin: 0;
				padding: 2px;
				background: none;
				border: none;
			}

			button:hover {
				background: var(--d2l-color-galena);
			}

			button:focus {
				background: var(--d2l-color-galena);
				border: 2px solid var(--d2l-color-celestine);
			}

			.volume-container {
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
			<video id="media" controls$="{{ _isMobileSafari() }}" preload="{{ _getPreload(autoLoad) }}" poster="{{ poster }}" on-tap="_onVideoTap" autoplay="{{ _getAutoplay(autoplay) }}" aria-label$="[[localize('Video Player')]]"></video>
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
								<d2l-seek-bar id="volumeBar" value="40" immediate-value="{{ rawVolume }}" vertical=""></d2l-seek-bar>
							</div>
						</div>
					</template>
				</div>
				<div class="layout horizontal center flex time-container" dir="ltr">
					<div class="time-control time-control-left d2l-body-compact">{{ _formatTime(currentTime) }}</div>
					<div class="flex seek-control">
						<d2l-seek-bar id="seekBar" value="[[ percentComplete ]]" immediate-value="{{ immediateValue }}" on-drag-start="_onSeekStart" on-drag-end="_onSeekEnd"></d2l-seek-bar>
					</div>
					<div class="time-control time-control-right d2l-body-compact">{{ _formatTime(duration) }}</div>
				</div>
				<div class="expand control">
					<button aria-label="Fullscreen" on-tap="_toggleFullscreen"><d2l-icon class="control-icon" icon="[[ _getFullscreenIcon(isFullscreen) ]]"></d2l-icon></button>
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
		volumeControlVisible: {
			type: Boolean,
			value: false
		}
	},

	hostAttributes: {
		tabindex: 0,
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

	_showVolumeControlByHover: function() {
		this.volumeControlVisible = true;
	},

	_hideVolumeControlByHover: function() {
		this.volumeControlVisible = false;
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
