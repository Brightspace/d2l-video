import '@polymer/polymer/polymer-legacy.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';

window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.D2LVideo = window.D2L.PolymerBehaviors.D2LVideo || {};
window.D2L.PolymerBehaviors.D2LVideo.LangTerms = window.D2L.PolymerBehaviors.D2LVideo.LangTerms || {};
/**
 * Localizes d2l-video
 * @polymerBehavior
 */
D2L.PolymerBehaviors.D2LVideo.LocalizeBehaviorImpl = {
	properties: {
		/**
		 * Localization resources
		 */
		resources: {
			value: function() {
				return window.D2L.PolymerBehaviors.D2LVideo.LangTerms;
			}
		}
	}
};

/** @polymerBehavior */
D2L.PolymerBehaviors.D2LVideo.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.D2LVideo.LocalizeBehaviorImpl
];
