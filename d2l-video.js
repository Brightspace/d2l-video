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
				background-color: rgba(0, 0, 0, 0.54);
				box-sizing: border-box;
				width: 100%;
			}

			#controlBar .control {
				position: relative;
			}

			#controlBar .control button:not([role=menuitem]) {
				margin: 3px;
				padding: 7px;
				border-radius: 4px;
				position: relative;
				position: relative;
				z-index: 1;
			}

			#controlBar .control button:hover {
				background: rgba(255, 255, 255, 0.2);
			}

			#controlBar .control button:focus {
				outline: 2px solid white;
				border-radius: 5px;
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
				color: white;
				padding: 2px;
			}

			d2l-icon[hidden] {
				display: none;
			}

			/* TODO: remove this once we use tier1 icons for play/pause (18px by default) */
			.play-pause-container d2l-icon {
				width: 18px;
				height: 18px;
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
				color: white;
			}

			.volume-control-container {
				padding: 5px 20px 5px 40px;
				position: absolute;
				bottom: 72px;
				left: -73px;
				transform: rotate(-90deg);
			}

			.volume-control {
				background-color: rgba(0, 0, 0, 0.54);
				border-radius: 0 8px 8px 0;
				width: 120px;
				padding: 12px 6px;
			}

			.playback-speed-control-container {
				position: absolute;
				bottom: 0px;
				padding-bottom: 40px;
				left: -15px;
			}

			#playback-speed-control {
				color: white;
				background-color: rgba(0, 0, 0, 0.54);
				border-radius: 5px 5px 0 0;
				overflow: hidden;
			}

			#playback-speed-control button {
				color: white;
				width: 100%;
				padding: 7px 30px;
				display: block;
				border-bottom: 1px solid rgba(255, 255, 255, 0.2);
			}

			#playback-speed-control button:last-child {
				border-bottom: none;
			}

			#playback-speed-control button[active] {
				background: rgba(255, 255, 255, 0.3);
			}

			.playback-speed-container .d2l-body-compact {
				color: white;
				width: 35px;
				display: inline-block;
			}

			button {
				cursor: pointer;
				margin: 0;
				padding: 2px;
				background: none;
				border: none;
			}

			.message-overlay {
				color: white;
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

			@media only screen and (max-width: 553px) {
				#controlBar {
					padding: 0;
				}

				#controlBar {
					padding: 0;
				}

				.play-pause-container {
					padding: 0;
				}

				#controlBar .control {
					margin: 2px;
					padding: 4px;
					border-radius: 4px;
					position: relative;
				}

				#controlBar .time-control,
				#controlBar .seek-control {
					margin: 0 2px;
				}
			}
			@media only screen and (max-width: 450px) {
				.playback-speed-container {
					display: none;
				}
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
					<button aria-label$="[[localize('Volume')]]" aria-haspopup="true" aria-expanded="{{ volumeControlVisible }}" on-tap="_toggleVolumeControl">
						<d2l-icon class="control-icon" icon="d2l-tier1:volume"></d2l-icon>
					</button>
					<template is="dom-if" if="{{ volumeControlVisible }}">
						<div class="volume-control-container" on-mouseover="_showVolumeControlByHover" on-mouseout="_hideVolumeControlByHover" >
							<div class="volume-control" on-tap="_onVolumeControlTap">
								<d2l-seek-bar id="volumeBar" value="40" immediate-value="{{ rawVolume }}" vertical="" aria-label$="[[localize('VolumeBar')]]"></d2l-seek-bar>
								<d2l-offscreen aria-live="assertive">[[localize('VolumeLevel', 'rawVolume', rawVolume)]]</d2l-offscreen>
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
				<div class="control playback-speed-container" on-mouseover="_showPlaybackSpeedControlByHover" on-mouseout="_hidePlaybackSpeedControlByHover">
					<button id="playback-speed-control-toggle" aria-label$="[[localize('PlaybackSpeed')]]" on-tap="_togglePlaybackSpeedControl" aria-haspopup="true" aria-controls="playback-speed-control" aria-expanded="{{ playbackSpeedControlVisible }}">
						<div class="playback-speed d2l-body-compact">{{ playbackSpeed }}x</div>
					</button>
					<template is="dom-if" if="{{ playbackSpeedControlVisible }}" id="playback-controls">
						<div class="playback-speed-control-container" on-mouseover="_showPlaybackSpeedControlByHover" on-mouseout="_hidePlaybackSpeedControlByHover" >
							<div role="menu" aria-labelledby="playback-speed-control-toggle" id="playback-speed-control">
								<dom-repeat items="{{ playbackSpeeds }}">
									<template>
										<button role="menuitem" on-tap="_onPlaybackSpeedControlChanged" value="{{ item.value }}" aria-label$="[[localize('PlaybackSpeedValue', 'playbackSpeed', item.display)]]">{{ item.display}}</button>
									</template>
								</dom-repeat>
							</div>
						</div>
					</template>
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
			type: Object,
			value: null,
		},
		playbackSpeed: {
			type: Number,
			value: 1,
		},
		playbackSpeeds: {
			value() {
				return [
					{ value: 0.25, display: '0.25'},
					{ value: 0.5, display: '0.5'},
					{ value: 1, display: 'Normal'},
					{ value: 1.25, display: '1.25'},
					{ value: 1.5, display: '1.5'},
					{ value: 2, display: '2'},
				];
			}
		},
		volumeControlVisible: {
			type: Boolean,
			value: false
		},
		playbackSpeedControlVisible: {
			type: Boolean,
			value: false
		},
		/**
		 * Tracks the currently focused item for managing tabindex
		 */
		_currentlyFocusedElement: {
			type: Node,
			value: null
		},
	},

	hostAttributes: {
		tabindex: 0
	},

	keyBindings: {
		'space': '_playPause',
		'f': '_toggleFullscreen',
		'esc': '_closeControls'
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
		this._closeControls();
		this._playPause();
	},

	_onVolumeControlTap: function(e) {
		e.stopPropagation();
	},

	_onPlaybackSpeedControlChanged: function(e) {
		if (this._currentPlaybackSpeedItem) {
			this._currentPlaybackSpeedItem.removeAttribute('active');
		}

		this._currentPlaybackSpeedItem = e.target;
		e.target.setAttribute('active', '');

		this.playbackSpeed = parseFloat(e.target.value);
		this.$.media.playbackRate = this.playbackSpeed;
	},

	_activeSpeed: function(value) {
		return value === this.playbackSpeed;
	},

	_rawVolumeChanged: function(rawVolume) {
		this.volume = rawVolume / 100;
	},

	_closeControls: function() {
		this.volumeControlVisible = false;
		this.playbackSpeedControlVisible = false;
	},

	_toggleFullscreen: function() {
		this._closeControls();
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

	_controlsOpen: function() {
		return this.volumeControlVisible || this.playbackSpeedControlVisible;
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
