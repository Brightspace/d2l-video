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
import ResizeObserver from 'resize-observer-polyfill';
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
				box-sizing: border-box;
				width: 100%;
				background: rgba(0, 0, 0, 0.69);
				transition: 0.1s;
				padding-top: 6px;
			}

			#controlBar:focus,
			#controlBar:focus-within {
				opacity: 1;
			}
			#controlBar[hidden] {
				opacity: 0;
			}

			#controlBar .control {
				position: relative;
			}

			#controlBar .control > button {
				margin: 3px;
				padding: 7px;
				border-radius: 4px;
				position: relative;
				z-index: 1;
			}

			#controlBar .control button:hover {
				background: rgba(255, 255, 255, 0.2);
			}

			#controlBar .control button:focus {
				box-shadow: 0 0 0 2px white;
				border-radius: 4px;
				outline: none;
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

			#seekBar {
				--d2l-knob-size: 15px;
				--d2l-outer-knob-color: var(--d2l-color-celestine-plus-1);
				--d2l-knob-focus-color: #fff;
				--d2l-knob-focus-size: 4px;
				--d2l-progress-border-radius: 0; 

				position: absolute;
				left: 0;
				right: 0;
				top: -4px;
			}

			#volumeBar {
				--d2l-knob-size: 18px;
				--d2l-outer-knob-color: var(--d2l-color-celestine-plus-1);
				--d2l-knob-focus-color: #fff;
				--d2l-knob-focus-size: 4px;
			}

			.time-container {
				margin-left: 9px;
			}

			.time-control-separator {
				margin: 0 5px;
			}

			.time-control, 
			.time-control-separator {
				color: white;
			}

			.volume-control-container .rotation-container {
				padding: 4px 20px 5px 46px;
				position: absolute;
				bottom: 76px;
				left: -77px;
				transform: rotate(-90deg);
			}

			.volume-control {
				background-color: rgba(0, 0, 0, 0.69);
				border-radius: 0 8px 8px 0;
				width: 120px;
				padding: 12px 6px;
			}

			.playback-speed-control-container {
				position: absolute;
				bottom: 6px;
				padding-bottom: 43px;
				left: -25px;
				overflow: hidden;
			}

			#playback-speed-control {
				color: white;
				background-color: rgba(0, 0, 0, 0.69);
				border-radius: 5px 5px 0 0;
				padding: 2px;
				overflow-y: auto;
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
				width: 32px;
				line-height: 22px;
				display: inline-block;
			}

			.playback-speed-container button {
				font-size: inherit;
				font-family: inherit;
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

			@media only screen and (max-width: 320px) {
				#controlBar {
					padding: 0;
					padding-top: 5px;
				}

				#controlBar .control {
					margin: 0;
					padding: 0;
					border-radius: 4px;
					position: relative;
				}

				#controlBar .control > button {
					padding: 2px;
				}

				#controlBar .time-control,
				#controlBar .seek-control {
					margin: 0 2px;
				}

				.volume-control-container {
					padding-left: 32px;
					bottom: 66px;
					left: -77px;
				}

				.playback-speed-container {
					display: none;
				}
			}
		</style>

		<fullscreen-api id="fsApi" target="{{ _getFsTarget() }}" fullscreen="{{ isFullscreen }}"></fullscreen-api>

		<div id="container" on-tap="_onContainerTap" on-mouseover="_onVideoMouseOver" on-mousemove="mousemove" on-focus="_onVideoFocus" on-keydown="_showControlsTemporary">
			<video id="media" controls$="{{ _isMobileSafari() }}" preload="{{ _getPreload(autoLoad) }}" poster="{{ poster }}" on-tap="_onVideoTap" autoplay="{{ _getAutoplay(autoplay) }}" aria-label$="[[localize('EvidenceVideoPlayer')]]"></video>
			<div id="controlBar" hidden$="{{ _controlsHidden() }}" class="layout horizontal center d2l-typography">
				<d2l-seek-bar fullWidth solid id="seekBar" value="[[ percentComplete ]]" immediate-value="{{ immediateValue }}" aria-label$="[[localize('SeekBar')]]" on-drag-start="_onSeekStart" on-drag-end="_onSeekEnd" on-position-change="_onPositionChange"></d2l-seek-bar>
				<div class="control play-pause-container">
					<button hidden$="{{ isPlaying }}" on-tap="_playPause" aria-label$="[[localize('Play')]]"><d2l-icon icon="d2l-tier1:play"></d2l-icon></button>
					<button hidden$="{{ !isPlaying }}" on-tap="_playPause" aria-label$="[[localize('Pause')]]"><d2l-icon icon="d2l-tier1:pause"></d2l-icon></button>
				</div>
				<div class="control volume-container" on-mouseover="_showVolumeControlByHover" on-mouseout="_hideVolumeControlByHover">
					<button aria-label$="[[localize('Volume')]]" aria-haspopup="true" aria-expanded="{{ volumeControlVisible }}" on-tap="_toggleVolumeControl">
						<d2l-icon class="control-icon" icon="d2l-tier1:volume"></d2l-icon>
					</button>
					<template is="dom-if" if="{{ volumeControlVisible }}">
						<div class="volume-control-container" on-mouseover="_showVolumeControlByHover" on-mouseout="_hideVolumeControlByHover" >
							<div class="rotation-container">
								<div class="volume-control" on-tap="_onVolumeControlTap">
									<d2l-seek-bar solid id="volumeBar" value="40" immediate-value="{{ rawVolume }}" vertical="" aria-label$="[[localize('VolumeBar')]]"></d2l-seek-bar>
								</div>
							</div>
							<d2l-offscreen aria-live="assertive">[[localize('VolumeLevel', 'rawVolume', rawVolume)]]</d2l-offscreen>
						</div>
					</template>
				</div>
				<div class="layout horizontal center flex time-container" dir="ltr">
					<div class="time-control time-control-left d2l-body-compact">{{ _formatTime(currentTime) }}</div>
					<div class="time-control-separator d2l-body-compact">/</div>
					<div class="time-control time-control-right d2l-body-compact">{{ _formatTime(duration) }}</div>
				</div>
				<div class="control playback-speed-container" on-mouseover="_showPlaybackSpeedControlByHover" on-mouseout="_hidePlaybackSpeedControlByHover">
					<button id="playback-speed-control-toggle" aria-label$="[[localize('PlaybackSpeed')]]" on-tap="_togglePlaybackSpeedControl" aria-haspopup="true" aria-controls="playback-speed-control" aria-expanded="{{ playbackSpeedControlVisible }}">
						<div class="playback-speed d2l-body-compact">[[localize('PlaybackSpeedDisplay', 'playbackSpeed', _playbackSpeed)]]</div>
					</button>
					<template is="dom-if" if="{{ playbackSpeedControlVisible }}" id="playback-controls">
						<div class="playback-speed-control-container" on-mouseover="_showPlaybackSpeedControlByHover" on-mouseout="_hidePlaybackSpeedControlByHover" >
							<div role="menu" aria-labelledby="playback-speed-control-toggle" id="playback-speed-control">
								<dom-repeat items="{{ _playbackSpeeds }}">
									<template>
										<button class="d2l-body-compact" role="menuitem" on-tap="_onPlaybackSpeedControlChanged" value="{{ item }}" aria-label$="[[localize('PlaybackSpeedLabel', 'playbackSpeed', item)]]">[[_playbackSpeedLabel(item)]]</button>
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
		isPlaying: {
			observer: '_onPlayPause'
		},
		_currentPlaybackSpeedItem: {
			type: Object,
			value: null,
		},
		_playbackSpeed: {
			type: Number,
			value: 1,
		},
		_playbackSpeeds: {
			type: Array,
			value: [
				0.25,
				0.5,
				0.75,
				1,
				1.25,
				1.5,
				2,
			],
		},
		_controlsVisible: {
			type: Boolean,
			value: true
		},
		volumeControlVisible: {
			type: Boolean,
			value: false
		},
		playbackSpeedControlVisible: {
			type: Boolean,
			value: false
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

	ready: function() {
		const observer = new ResizeObserver(() => {
			this._handleControlHeight();
		});
		observer.observe(this);
	},


	mousemove: function() {
		this._showControlsTemporary();
	},

	_onPlayPause: function() {
		this._showControlsTemporary();
	},

	_showControlsTemporary: function() {
		this._showControls();

		if (!this.fadeInBuffer) {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = 0;
			}
			this._showControls();
		} else {
			this.fadeInBuffer = false;
		}

		if (this.isPlaying) {
			this.timer = setTimeout(() => {
				this.fadeInBuffer = true;
				this._hideControls();
			}, 3000);
		}
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

		this._playbackSpeed = parseFloat(e.target.value);
		this.$.media.playbackRate = this._playbackSpeed;
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

	_controlsHidden: function() {
		return !this._controlsVisible || this._isMobileSafari();
	},

	_showControls: function() {
		this._controlsVisible = true;
		this.shadowRoot.querySelector('#controlBar').removeAttribute('hidden');
		this._handleControlHeight();
	},

	_hideControls: function() {
		this._controlsVisible = false;
		this.shadowRoot.querySelector('#controlBar').setAttribute('hidden', '');
	},

	_handleControlHeight: function() {
		const control = this.shadowRoot.querySelector('#playback-speed-control');
		if (control) {
			if (this.offsetHeight < 320) {
				control.style.height = `${this.offsetHeight - 60}px`;
			} else {
				control.style.height = '263px';
			}
		}
	},

	_onVideoMouseOver: function() {
		this._showControls();
	},

	_playbackSpeedLabel: function(playbackSpeed) {
		if (playbackSpeed === 1) {
			return this.localize('PlaybackSpeedNormal');
		} else {
			return playbackSpeed;
		}
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
