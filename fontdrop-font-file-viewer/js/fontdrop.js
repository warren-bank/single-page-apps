"use strict";



define('fontdrop/app', ['exports', 'fontdrop/resolver', 'ember-load-initializers', 'fontdrop/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = void 0;

  App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('fontdrop/components/compare-characters', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		classNames: ['compareCharacters'],
		allCharacters: [],

		getCharacters: function () {
			var glyphs = this.get('fontOne.glyphs.glyphs');
			var fontUniIndex = [];
			Object.keys(glyphs).forEach(function (key) {
				var val = glyphs[key]['unicodes'];
				if (val !== 'undefined' && val.length > 0) {
					fontUniIndex.push(String.fromCharCode(val[0]));
				}
			});
			this.set('allCharacters', fontUniIndex);
		}.observes('fontOne')

	});
});
define('fontdrop/components/compare-drop-one', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		tagName: 'div',
		classNames: 'dropzone'.w(),
		classNameBindings: 'isDragging isDisabled:is-disabled'.w(),
		attributeBindings: 'data-uploader'.w(),
		'data-uploader': 'true',
		isDisabled: false,

		fileTypes: ['otf', 'ttf', 'woff', 'woff2'],
		fileExtension: false,

		error: null,
		filenameOne: null,
		fontFullNameOne: null,
		fontVersionOne: null,

		dragEnter: function dragEnter(event) {
			event.preventDefault();
			this.set('isDragging', true);
			document.getElementById("fontDropBody").classList.add('dropOn');
		},
		dragOver: function dragOver(event) {
			event.preventDefault();
			this.set('isDragging', true);
			document.getElementById("fontDropBody").classList.add('dropOn');
		},
		dragLeave: function dragLeave(event) {
			event.preventDefault();
			this.set('isDragging', false);
			document.getElementById("fontDropBody").classList.remove('dropOn');
		},
		drop: function drop(event) {
			event.preventDefault();
			this.set('isDragging', false);
			document.getElementById("fontDropBody").classList.remove('dropOn');
			var file = event.dataTransfer.files[0];
			this.set('fileExtension', file.name.split('.').pop().toLowerCase());
			var checkFileType = this.get('fileTypes').indexOf(this.get('fileExtension')) > -1;
			if (checkFileType) {
				//yes
				this.set('filenameOne', file.name);
				document.getElementById("messageOne").innerHTML = file.name;
				this.set('isDisabled', true);
				this.sendAction('fileInputChanged', file);
				this.parseFont(file);
				this.viewFont(file);
			} else {
				document.getElementById("messageOne").innerHTML = '<span class="warning label">Only works with OTF, TTF, WOFF and WOFF2 files.</span>';
			}
		},
		parseFont: function parseFont(fontfile) {
			var reader = new FileReader();
			var _this = this,
			    file = void 0;
			reader.onload = function (e) {
				var error = _this.get('error');
				console.log(error);
				/* check woff2 and decompress */
				if (_this.get('fileExtension') === "woff2") {
					file = Uint8Array.from(Module.decompress(e.target.result)).buffer;
				} else {
					file = e.target.result;
				}
				/* global opentype */
				var fontOne = opentype.parse(file);
				_this.attrs.send(fontOne);
				_this.set('fontFullNameOne', fontOne.names.fullName.en);
				_this.set('fontVersionOne', fontOne.tables.name.version.en);
			};
			reader.onerror = function (err) {
				_this.set('error', err);
			};
			reader.readAsArrayBuffer(fontfile);
		},
		viewFont: function viewFont(fontfile) {
			var reader = new FileReader();
			reader.onload = function (e) {
				document.getElementById("uploadedFontCompareOne").innerHTML = '<style>' + '@font-face{' + 'font-family: compareOne;' + 'src: url(' + e.target.result + ');' + '}' + '.compareFontOne {font-family: compareOne, AdobeBlank; font-weight:normal;}' + '.languagesFontOne {font-family: compareOne, sans-serif; font-weight:normal;}' + '</style>';
			};
			reader.readAsDataURL(fontfile);
		},

		actions: {
			uploadFontCompareOne: function uploadFontCompareOne(e) {
				var file = e.target.files[0];
				this.set('fileExtension', file.name.split('.').pop().toLowerCase());
				var checkFileType = this.get('fileTypes').indexOf(this.get('fileExtension')) > -1;
				if (checkFileType) {
					this.set('filenameOne', file.name);
					document.getElementById("messageOne").innerHTML = file.name;
					this.set('isDisabled', true);
					this.sendAction('fileInputChanged', file);
					this.parseFont(file);
					this.viewFont(file);
				} else {
					document.getElementById("messageOne").innerHTML = '<span class="warning label">Only works with OTF, TTF, WOFF and WOFF2 files.</span>';
				}
			}
		}

	});
});
define('fontdrop/components/compare-drop-two', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		tagName: 'div',
		classNames: 'dropzone'.w(),
		classNameBindings: 'isDragging isDisabled:is-disabled'.w(),
		attributeBindings: 'data-uploader'.w(),
		'data-uploader': 'true',
		isDisabled: false,

		fileTypes: ['otf', 'ttf', 'woff', 'woff2'],
		fileExtension: false,

		error: null,
		filenameTwo: null,
		fontFullNameTwo: null,
		fontVersionTwo: null,

		dragEnter: function dragEnter(event) {
			event.preventDefault();
			this.set('isDragging', true);
			document.getElementById("fontDropBody").classList.add('dropOn');
		},
		dragOver: function dragOver(event) {
			event.preventDefault();
			this.set('isDragging', true);
			document.getElementById("fontDropBody").classList.add('dropOn');
		},
		dragLeave: function dragLeave(event) {
			event.preventDefault();
			this.set('isDragging', false);
			document.getElementById("fontDropBody").classList.remove('dropOn');
		},
		drop: function drop(event) {
			event.preventDefault();
			this.set('isDragging', false);
			document.getElementById("fontDropBody").classList.remove('dropOn');
			var file = event.dataTransfer.files[0];
			this.set('fileExtension', file.name.split('.').pop().toLowerCase());
			var checkFileType = this.get('fileTypes').indexOf(this.get('fileExtension')) > -1;
			if (checkFileType) {
				//yes
				this.set('filenameTwo', file.name);
				document.getElementById("messageTwo").innerHTML = file.name;
				this.set('isDisabled', true);
				this.sendAction('fileInputChanged', file);
				this.parseFontTwo(file);
				this.viewFontTwo(file);
			} else {
				document.getElementById("messageTwo").innerHTML = '<span class="warning label">Sorry but only works with OTF, TTF or WOFF files.</span>';
			}
		},
		parseFontTwo: function parseFontTwo(fontfiletwo) {
			var reader = new FileReader();
			var _this = this,
			    file = void 0;
			reader.onload = function (e) {
				var error = _this.get('error');
				console.log(error);
				/* check woff2 and decompress */
				if (_this.get('fileExtension') === "woff2") {
					file = Uint8Array.from(Module.decompress(e.target.result)).buffer;
				} else {
					file = e.target.result;
				}
				/* global opentype */
				var fontTwo = opentype.parse(file);
				_this.set('fontFullNameTwo', fontTwo.names.fullName.en);
				_this.set('fontVersionTwo', fontTwo.tables.name.version.en);
			};
			reader.onerror = function (err) {
				_this.set('error', err);
			};
			reader.readAsArrayBuffer(fontfiletwo);
		},
		viewFontTwo: function viewFontTwo(fontfiletwo) {
			var reader = new FileReader();
			reader.onload = function (e) {
				document.getElementById("uploadedFontCompareTwo").innerHTML = '<style>' + '@font-face{' + 'font-family: compareTwo;' + 'src: url(' + e.target.result + ');' + '}' + '.compareFontTwo {font-family: compareTwo, AdobeBlank;}' + '</style>';
			};
			reader.readAsDataURL(fontfiletwo);
		},

		actions: {
			uploadFontCompareTwo: function uploadFontCompareTwo(e) {
				var file = e.target.files[0];
				this.set('fileExtension', file.name.split('.').pop().toLowerCase());
				var checkFileType = this.get('fileTypes').indexOf(this.get('fileExtension')) > -1;
				if (checkFileType) {
					this.set('filenameTwo', file.name);
					document.getElementById("messageTwo").innerHTML = file.name;
					this.set('isDisabled', true);
					this.sendAction('fileInputChanged', file);
					this.parseFontTwo(file);
					this.viewFontTwo(file);
				} else {
					document.getElementById("messageTwo").innerHTML = '<span class="warning label">Sorry but only works with OTF, TTF or WOFF (not WOFF2)!</span>';
				}
			}
		}

	});
});
define("fontdrop/components/compare-info", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        didInsertElement: function didInsertElement() {
            this.$().foundation(); //or Ember.$(document).foundation();
        },


        compareText: "Traditionally, text is composed to create a readable, coherent, and visually satisfying typeface that works invisibly, without the awareness of the reader. Even distribution of typeset material, with a minimum of distractions and anomalies, is aimed at producing clarity and transparency. Choice of typeface(s) is the primary aspect of text typography—prose fiction, non-fiction, editorial, educational, religious, scientific, spiritual, and commercial writing all have differing characteristics and requirements of appropriate typefaces (and their fonts or styles). For historic material, established text typefaces frequently are chosen according to a scheme of historical genre acquired by a long process of accretion, with considerable overlap among historical periods. Contemporary books are more likely to be set with state-of-the-art “text roman” or “book romans” typefaces with serifs and design values echoing present-day design arts, which are closely based on traditional models such as those of Nicolas Jenson, Francesco Griffo (a punchcutter who created the model for Aldine typefaces), and Claude Garamond. [Source: Wikipedia, Typography]",
        compareCompareTexts: null,

        waterfallLine: "The quick brown fox jumps over the lazy dog.",
        waterfallFontSizes: [96, 84, 72, 60, 48, 36, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8],

        actions: {
            setCompare: function setCompare(id) {
                var result = this.get('compareTexts').findBy('id', id);
                this.set('compareText', result.sample);
                this.set('direction', result.direction);
            },
            setWaterfall: function setWaterfall(id) {
                var result = this.get('waterfallTexts').findBy('id', id);
                this.set('waterfallLine', result.sample);
            },
            updateWaterfallText: function updateWaterfallText(text) {
                this.set('waterfallLine', text);
            }
        }

    });
});
define('fontdrop/components/ember-tether', ['exports', 'ember-tether/components/ember-tether'], function (exports, _emberTether) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberTether.default;
    }
  });
});
define('fontdrop/components/font-data', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		classNames: ['nameingArea'],

		didInsertElement: function didInsertElement() {
			this._super();
			Ember.run.scheduleOnce('afterRender', this, this.readMore);
		},

		readMore: function readMore() {
			var showChar = 100; // How many characters are shown by default
			var ellipsestext = "...";
			var moretext = "Show more >";
			var lesstext = "Show less";

			this.$('.more').each(function () {
				var content = this.$('.more').html();

				if (content.length > showChar) {

					var c = content.substr(0, showChar);
					var h = content.substr(showChar, content.length - showChar);

					var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

					this.$('.more').html(html);
				}
			});

			this.$(".morelink").click(function () {
				if (this.$(".morelink").hasClass("less")) {
					this.$(".morelink").removeClass("less");
					this.$(".morelink").html(moretext);
				} else {
					this.$(".morelink").addClass("less");
					this.$(".morelink").html(lesstext);
				}
				this.$(".morelink").parent().prev().toggle();
				this.$(".morelink").prev().toggle();
				return false;
			});
		}

	});
});
define('fontdrop/components/font-drop', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		tagName: 'div',
		classNames: 'dropzone'.w(),
		classNameBindings: 'isDragging isDisabled:is-disabled'.w(),
		attributeBindings: 'data-uploader'.w(),
		'data-uploader': 'true',
		isDisabled: false,

		fileTypes: ['otf', 'ttf', 'woff', 'woff2'],
		fileExtension: false,

		error: null,
		filename: null,

		dragEnter: function dragEnter(event) {
			event.preventDefault();
			this.set('isDragging', true);
			document.getElementById("fontDropBody").classList.add('dropOn');
		},
		dragOver: function dragOver(event) {
			event.preventDefault();
			this.set('isDragging', true);
			document.getElementById("fontDropBody").classList.add('dropOn');
		},
		dragLeave: function dragLeave(event) {
			event.preventDefault();
			this.set('isDragging', false);
			document.getElementById("fontDropBody").classList.remove('dropOn');
		},
		drop: function drop(event) {
			event.preventDefault();
			this.set('isDragging', false);
			document.getElementById("fontDropBody").classList.remove('dropOn');
			var file = event.dataTransfer.files[0];
			var filesize = Math.floor(Math.log(file.size) / Math.log(1024));
			var nicerFileSize = (file.size / Math.pow(1024, filesize)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][filesize];
			this.set('fileExtension', file.name.split('.').pop().toLowerCase());
			var checkFileType = this.get('fileTypes').indexOf(this.get('fileExtension')) > -1;
			if (checkFileType) {
				//yes
				this.set('filename', file.name);
				document.getElementById("message").innerHTML = file.name;
				document.getElementById("fileSize").innerHTML = ', ' + nicerFileSize;
				document.getElementById("highlightBar").classList.add('hideHighlight');
				this.set('isDisabled', true);
				// this.sendAction('fileInputChanged', file); // (was ist das?)
				this.parseFont(file);
				this.viewFont(file);
			} else {
				document.getElementById("message").innerHTML = '<span class="warning label">Only works with OTF, TTF, WOFF and WOFF2 files.</span>';
			}
		},

		parseFont: function parseFont(fontfile) {
			var reader = new FileReader();
			var _this = this,
			    file = void 0;
			reader.onload = function (e) {
				var error = _this.get('error');
				console.log(error);
				/* check woff2 and decompress */
				if (_this.get('fileExtension') === "woff2") {
					file = Uint8Array.from(Module.decompress(e.target.result)).buffer;
				} else {
					file = e.target.result;
				}
				/* global opentype */
				var font = opentype.parse(file);
				_this.attrs.send(font);
			};
			reader.onerror = function (err) {
				_this.set('error', err);
				console.log('Error: ' + err.toString());
			};
			document.getElementById("parsingFont").classList.toggle('parsingDone');
			reader.readAsArrayBuffer(fontfile);
		},
		viewFont: function viewFont(fontfile) {
			var reader = new FileReader();
			reader.onload = function (e) {
				document.getElementById("uploadedFont").innerHTML = '<style>' + '@font-face{' + 'font-family: preview;' + 'src: url(' + e.target.result + ');' + '}' + '.droppedFont {font-family: preview, AdobeBlank;}' + '#font-name .droppedFont {font-family: preview, AttributeFaux, AdobeBlank;}' + '</style>';
			};
			reader.readAsDataURL(fontfile);
		},

		actions: {
			uploadFont: function uploadFont(e) {
				var file = e.target.files[0];
				var filesize = Math.floor(Math.log(file.size) / Math.log(1024));
				var nicerFileSize = (file.size / Math.pow(1024, filesize)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][filesize];
				this.set('fileExtension', file.name.split('.').pop().toLowerCase());
				var checkFileType = this.get('fileTypes').indexOf(this.get('fileExtension')) > -1;
				if (checkFileType) {
					this.set('filename', file.name);
					document.getElementById("message").innerHTML = file.name;
					document.getElementById("fileSize").innerHTML = ', ' + nicerFileSize;
					document.getElementById("highlightBar").classList.add('hideHighlight');
					this.set('isDisabled', true);
					// this.sendAction('fileInputChanged', file); // (was ist das?)
					this.parseFont(file);
					this.viewFont(file);
				} else {
					document.getElementById("message").innerHTML = '<span class="warning label">Only works with OTF, TTF, WOFF and WOFF2 files.</span>';
				}
			}
		}

	});
});
define("fontdrop/components/font-info", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	exports.default = Ember.Component.extend({
		didInsertElement: function didInsertElement() {
			this.$().foundation(); //or Ember.$(document).foundation();
		},


		specimenTexts: [{ id: "1", name: "Latin", direction: "ltr", sample: "Traditionally, text is composed to create a readable, coherent, and visually satisfying typeface that works invisibly, without the awareness of the reader. Even distribution of typeset material, with a minimum of distractions and anomalies, is aimed at producing clarity and transparency. Choice of typeface(s) is the primary aspect of text typography—prose fiction, non-fiction, editorial, educational, religious, scientific, spiritual, and commercial writing all have differing characteristics and requirements of appropriate typefaces (and their fonts or styles). For historic material, established text typefaces frequently are chosen according to a scheme of historical genre acquired by a long process of accretion, with considerable overlap among historical periods. Contemporary books are more likely to be set with state-of-the-art “text roman” or “book romans” typefaces with serifs and design values echoing present-day design arts, which are closely based on traditional models such as those of Nicolas Jenson, Francesco Griffo (a punchcutter who created the model for Aldine typefaces), and Claude Garamond. [Source: Wikipedia, Typography]" }, { id: "2", name: "H&Co LC", direction: "ltr", sample: "H&Co Lowercase 1.0: Angel Adept Blind Bodice Clique Coast Dunce Docile Enact Eosin Furlong Focal Gnome Gondola Human Hoist Inlet Iodine Justin Jocose Knoll Koala Linden Loads Milliner Modal Number Nodule Onset Oddball Pneumo Poncho Quanta Qophs Rhone Roman Snout Sodium Tundra Tocsin Uncle Udder Vulcan Vocal Whale Woman Xmas Xenon Yunnan Young Zloty Zodiac. Angel angel adept for the nuance loads of the arena cocoa and quaalude. Blind blind bodice for the submit oboe of the club snob and abbot. Clique clique coast for the pouch loco of the franc assoc and accede. Dunce dunce docile for the loudness mastodon of the loud statehood and huddle. Enact enact eosin for the quench coed of the pique canoe and bleep. Furlong furlong focal for the genuflect profound of the motif aloof and oers. Gnome gnome gondola for the impugn logos of the unplug analog and smuggle. Human human hoist for the buddhist alcohol of the riyadh caliph and bathhouse. Inlet inlet iodine for the quince champion of the ennui scampi and shiite. Justin justin jocose for the djibouti sojourn of the oranj raj and hajjis. Knoll knoll koala for the banknote lookout of the dybbuk outlook and trekked. Linden linden loads for the ulna monolog of the consul menthol and shallot. Milliner milliner modal for the alumna solomon of the album custom and summon. Number number nodule for the unmade economic of the shotgun bison and tunnel. Onset onset oddball for the abandon podium of the antiquo tempo and moonlit. Pneumo pneumo poncho for the dauphin opossum of the holdup bishop and supplies. Quanta quanta qophs for the inquest sheqel of the cinq coq and suqqu. Rhone rhone roman for the burnt porous of the lemur clamor and carrot. Snout snout sodium for the ensnare bosom of the genus pathos and missing. Tundra tundra tocsin for the nutmeg isotope of the peasant ingot and ottoman. Uncle uncle udder for the dunes cloud of the hindu thou and continuum. Vulcan vulcan vocal for the alluvial ovoid of the yugoslav chekhov and revved. Whale whale woman for the meanwhile blowout of the forepaw meadow and glowworm. Xmas xmas xenon for the bauxite doxology of the tableaux equinox and exxon. Yunnan yunnan young for the dynamo coyote of the obloquy employ and sayyid. Zloty zloty zodiac for the gizmo ozone of the franz laissez and buzzing." }, { id: "3", name: "H&Co UC", direction: "ltr", sample: "H&Co Uppercase 1.0: ABIDE ACORN OF THE HABIT DACRON FOR THE BUDDHA GOUDA QUAALUDE. BENCH BOGUS OF THE SCRIBE ROBOT FOR THE APLOMB JACOB RIBBON. CENSUS CORAL OF THE SPICED JOCOSE FOR THE BASIC HAVOC SOCCER. DEMURE DOCILE OF THE TIDBIT LODGER FOR THE CUSPID PERIOD BIDDER. EBBING ECHOING OF THE BUSHED DECAL FOR THE APACHE ANODE NEEDS. FEEDER FOCUS OF THE LIFER BEDFORD FOR THE SERIF PROOF BUFFER. GENDER GOSPEL OF THE PIGEON DOGCART FOR THE SPRIG QUAHOG DIGGER. HERALD HONORS OF THE DIHEDRAL MADHOUSE FOR THE PENH RIYADH BATHHOUSE. IBSEN ICEMAN OF THE APHID NORDIC FOR THE SUSHI SAUDI SHIITE. JENNIES JOGGER OF THE TIJERA ADJOURN FOR THE ORANJ KOWBOJ HAJJIS. KEEPER KOSHER OF THE SHRIKE BOOKCASE FOR THE SHEIK LOGBOOK CHUKKAS. LENDER LOCKER OF THE CHILD GIGOLO FOR THE UNCOIL GAMBOL ENROLLED. MENACE MCCOY OF THE NIMBLE TOMCAT FOR THE DENIM RANDOM SUMMON. NEBULA NOSHED OF THE INBRED BRONCO FOR THE COUSIN CARBON KENNEL. OBSESS OCEAN OF THE PHOBIC DOCKSIDE FOR THE GAUCHO LIBIDO HOODED. PENNIES PODIUM OF THE SNIPER OPCODE FOR THE SCRIP BISHOP HOPPER. QUANTA QOPHS OF THE INQUEST OQOS FOR THE CINQ COQ SUQQU. REDUCE ROGUE OF THE GIRDLE ORCHID FOR THE MEMOIR SENSOR SORREL. SENIOR SCONCE OF THE DISBAR GODSON FOR THE HUBRIS AMENDS LESSEN. TENDON TORQUE OF THE UNITED SCOTCH FOR THE NOUGHT FORGOT BITTERS. UNDER UGLINESS OF THE RHUBARB SEDUCE FOR THE MANCHU HINDU CONTINUUM. VERSED VOUCH OF THE DIVER OVOID FOR THE TELAVIV KARPOV FLIVVER. WENCH WORKER OF THE UNWED SNOWCAP FOR THE ANDREW ESCROW GLOWWORM. XENON XOCHITL OF THE MIXED BOXCAR FOR THE SUFFIX ICEBOX EXXON. YEOMAN YONDER OF THE HYBRID ARROYO FOR THE DINGHY BRANDY SAYYID. ZEBRA ZOMBIE OF THE PRIZED OZONE FOR THE FRANZ ARROZ BUZZING." }, { id: "4", name: "Arabic", direction: "rtl", sample: "التيبوغرافية أي فن صياغة الحروف (بالفرنسية القديمة: typographie) هو فن وأسلوب ترتيب اللغة المكتوبة لجعلها مرئية وساهلة قراءة وجاذبة.  ترتيب الحوف يشمل كل من اختيار عائلة الخط وحجم وطول الخط والمسافة بين السطور وبين الحروف وحتى تعديل المسافة بين زوجين من الحروف والوصلات الأبجدية. وتصميم الخطوط فن وثيق الصلة، حتى يعتبر جزءا من فن صياغة الحروف. وفن صياغة الحروف قد يستعمل في الزخرفة، بدون علاقة ببلاغ المعلومات. يختصر في كونه وسيلة تبين مدى الحس الفني لدى المصمم. ويعتمد فيه على استخدام الحروف غالبا، ليخرج المصمم لوحه فنية معبرة تتكون من حروف وجمل مرتبطة بالشكل المرسوم. وإن كانت الحروف أصعبها نظرا لوجود النقط على الحروف. يعتمد لذلك على تكرار الحروف والجمل بشكل جمالي بسيط، واستخدام أحجام مختلفة من الحروف والكلمات." }, { id: "5", name: "Armenian", direction: "ltr", sample: "Երբ ձեռքս նոր գիրք է ընկնում՝ մի առարկա, որը պատրաստվել է տպարանում գրաշարի, յուրահատուկ այդ հերոսի ձեռքով, մի ինչ-որ այլ հերոսի հնարած մեքենայի օգնությամբ, ես զգում եմ, որ նոր, կենդանի, խոսող, հրաշալի մի բան է մտնում իմ կյանքի մեջ։ Դա նոր պատգամ է, որ մարդը գրել է իր մասին աշխարհի ամենաբարդ, ամենախորհրդավոր, ամենամեծ սիրո արժանի արարածի մասին, որի աշխատանքով ու երեւակայությամբ են ստեղծվել աշխարհում այն ամենը, ինչ մեծ է ու սքանչելի։" }, { id: "6", name: "Cyrilic", direction: "ltr", sample: "Но расцвет типографики как отдельной сферы деятельности начался в Европе, где она появилась в середине XV века. Её распространению способствовали лёгкость и относительно малое количество символов в латинском шрифте, в отличие от китайских иероглифов. Первым, кто серьёзно занялся европейским типографическим искусством, стал Иоганн Гутенберг (1397—1468 гг.), немецкий изобретатель и ювелир. Создав в 1440 году из свинцовых букв наборную форму, он подарил миру первый печатный станок. Отныне создавать книги стало гораздо проще, их стоимость уменьшилась, а количество — возросло." }, { id: "7", name: "Greek", direction: "ltr", sample: "Τυπογραφία είναι η τέχνη της αποτύπωσης γραπτού λόγου και εικόνων σε χαρτί, ύφασμα, μέταλλο ή άλλο υλικό με τη βοήθεια τεχνικών μέσων και συνήθως σε μαζική κλίμακα. Η τυπογραφία ξεκίνησε ουσιαστικά τον 15ο αι. με την εφεύρεση του επίπεδου πιεστηρίου από τον Γουτεμβέργιο. Μέχρι τα τέλη του 20ού αι., η παραδοσιακή τυπογραφία χρησιμοποιούσε κινητά στοιχεία σε διάφορα μεγέθη και οικογένειες (γραμματοσειρές) φτιαγμένες από μέταλλο και σπανιότερα από ξύλο. Τα στοιχεία αυτά έμπαιναν σε ειδικές θήκες, τους σελιδοθέτες, και κατόπιν στο πιεστήριο για την εκτύπωση." }, { id: "8", name: "Hebrew", direction: "rtl", sample: "טיפוגרפיה (Typography) היא האמנות והטכניקה של סידור ועיצוב טקסט. סידור אותיות כולל בחירת גופנים, גודל אות, גודל השוליים, אורך שורה, ריווח בין שורות, בין מילים, בין אותיות ובין צמדי אותיות. במלאכת הטיפוגרפיה עוסקים, בין היתר, מעצבים גרפיים, מעצבי אותיות, טיפוגרפים ופרסומאים." }, { id: "p", name: "Hindi", direction: "ltr", sample: "मुद्रण कला मुद्रण को सजाने, मुद्रण डिजाइन तथा मुद्रण ग्लिफ्स को संशोधित करने की कला एवं तकनीक है। मुद्रण ग्लिफ़ को विभिन्न उदाहरण तकनीकों का उपयोग करके बनाया और संशोधित किया जाता है। मुद्रण की सजावट में टाइपफेस का चुनाव, प्वायंट साईज, लाइन की लंबाई, लिडिंग (लाइन स्पेसिंग) अक्षर समूहों के बीच स्पेस (ट्रैकिंग) तथा अक्षर जोड़ों के बीच के स्पेस (केर्निंग) को व्यवस्थित करना शामिल हैं. टाइपोग्राफी का टाइपसेटर, कम्पोजिटर, टाइपोग्राफर, ग्राफिक डिजाइनर, कला निर्देशक, कॉमिक बुक कलाकार, भित्तिचित्र कलाकार तथा क्लैरिकल वर्करों द्वारा किया जाता है। डिजिटल युग के आने तक टाइपोग्राफी एक विशेष प्रकार का व्यवसाय था। डिजिटलीकरण ने टाइपोग्राफी को नई पीढ़ी के दृश्य डिजाइनरों और ले युजरों के लिए सुगम बना दिया." }, { id: "9", name: "Vietnames", direction: "ltr", sample: "Hệ chữ viết là là một phương pháp lưu trữ thông tin và chuyển giao tin nhắn (thể hiện suy nghĩ hoặc ý tưởng) được tổ chức (thông thường được chuẩn hóa) trong một ngôn ngữ bằng cách mã hóa và giải mã theo cách trực quan (hoặc có thể gián tiếp). Quá trình mã hóa và giải mã này được gọi là viết và đọc, bao gồm một tập hợp các dấu hiệu hoặc chữ tượng hình, cả hai được biết đến như là các ký tự. Các ký tự này bao gồm cả chữ và số, thường được ghi vào một vật lưu trữ như giấy hoặc thiết bị lưu trữ điện tử. Các phương pháp không bền cũng có thể được sử dụng, chẳng hạn như viết trên cát hoặc vẽ lên trời bằng khói máy bay." }],

		waterfallLine: "The quick brown fox jumps over the lazy dog.",
		waterfallFontSizes: [96, 84, 72, 60, 48, 36, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8],
		specimenText: "Traditionally, text is composed to create a readable, coherent, and visually satisfying typeface that works invisibly, without the awareness of the reader. Even distribution of typeset material, with a minimum of distractions and anomalies, is aimed at producing clarity and transparency. Choice of typeface(s) is the primary aspect of text typography—prose fiction, non-fiction, editorial, educational, religious, scientific, spiritual, and commercial writing all have differing characteristics and requirements of appropriate typefaces and their fonts or styles.",
		fontInfoSpecimenTexts: null,
		typeYourselfFontSize: "48",
		typeYourselfLineHeight: "1.2",
		contenteditableStyleHtml: Ember.computed('typeYourselfFontSize', 'typeYourselfLineHeight', function () {
			return Ember.String.htmlSafe('font-size:' + this.get('typeYourselfFontSize') + 'px;line-height:' + this.get('typeYourselfLineHeight'));
		}),

		ligatureListNew: {},
		ligatureFeaturesCount: 0,
		ligatureCount: 0,
		substituteListNew: {},
		otherLookups: false,
		gposFeatures: false,
		gposFeatureList: [],

		color: 'red',

		afterParsingFont: function () {
			Ember.run.scheduleOnce('afterRender', this, function () {
				document.getElementById("parsingFont").classList.toggle('parsingDone');
			});
		}.observes('font'),

		watchWaterfallText: function () {
			this.send("setWaterfall");
		}.observes('waterfallTexts'),

		watchFont: function () {
			var font = this.get('font');
			this.displayFontData(font);
			// check if GSUB in font
			if (font.tables.gsub) {
				this.parseGSUB(font);
			} else {
				var ligatureListObj = {};
				this.set('ligatureListNew', ligatureListObj);
				var ligatureFeaturesCount = 0;
				this.set('ligatureFeaturesCount', ligatureFeaturesCount);
				var ligatureCount = 0;
				this.set('ligatureCount', ligatureCount);
				var substituteListObj = {};
				this.set('substituteListNew', substituteListObj);
				this.set('otherLookups', false);
			}
			// check if GPOS in font
			if (typeof font.tables.gpos !== 'undefined' && font.tables.gpos.features.length > 0) {
				this.parseGPOS(font);
			} else {
				this.set('gposFeatures', false);
				var gposFeatureList = [];
				this.set('gposFeatureList', gposFeatureList);
			}
		}.observes('font'),

		escapeHtml: function escapeHtml(unsafe) {
			return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\u0022/g, '&quot;').replace(/\u0027/g, '&#039;');
		},

		sortKeys: function sortKeys(dict) {
			var keys = [];
			for (var key in dict) {
				keys.push(key);
			}
			keys.sort();
			return keys;
		},

		// add font.name.sampleText to specimenTexts if exist
		sampleText: function () {
			var font = this.get('font');
			if (font.names.sampleText) {
				var textValue = this.get('font.names.sampleText.en');
				this.set('fontInfoSpecimenTexts', textValue);
			} else {
				this.set('fontInfoSpecimenTexts', null);
			}
		}.observes('font'),

		// GSUB features
		parseGSUB: function parseGSUB() {
			var glyphIndexMap = this.get('font.tables.cmap.glyphIndexMap');
			var reverseGlyphIndexMap = {};
			Object.keys(glyphIndexMap).forEach(function (key) {
				var value = glyphIndexMap[key];
				reverseGlyphIndexMap[value] = key;
			});
			// get all features, lookups and glyphs from font
			var features = this.get('font.tables.gsub.features');
			var lookups = this.get('font.tables.gsub.lookups');
			var glyphs = this.get('font.glyphs.glyphs');
			// get all otfeatures to check from database
			var otFeatures = this.get('otFeatures');

			// otFeatureData -- wofür brauchen wir das noch mal??
			var otFeatureData = [{ tag: "liga", name: "Standard Ligatures" }, { tag: "calt", name: "Contextual Alternates" }, { tag: "rlig", name: "Requiered Ligatures" }, { tag: "hlig", name: "Historical Ligatures" }];
			Object.keys(otFeatures).forEach(function (key) {
				var val = { 'tag': otFeatures[key]["tag"], 'name': otFeatures[key]["name"], 'desc': otFeatures[key]["desc"] };
				otFeatureData.push(val);
			});
			// console.log('otFeatureData (still needed ??)');
			// console.log(otFeatureData);

			// console.log('otFeatures static database');
			// console.log(otFeatures);

			// Try:
			// var otFeatureData = this.get('otFeatures')
			// and delete var otFeatures

			//
			//
			// New Approach
			// This will also keep the unknown and custom features!
			// 


			// store subtables with ligaturesSets
			var subtablesLig = [];
			// store subtables with substitutions
			var subtablesSubs = [];
			// make a note if there is more
			var otherLookupTypes = false;
			// parse features for lookups to get all subtables with ligatureSets and OT features
			features.forEach(function (feature) {
				// first check if feature is in otFeatures database
				//
				// if ( otFeatureData.some(item => item.tag === feature.tag) ) {
				//
				feature.feature.lookupListIndexes.forEach(function (i) {
					// lookuptype 1, Single Substitution Format 1, deltaGlyphId
					// lookuptype 1, Single Substitution Format 2, substituteGlyphIDs[glyphCount]
					if (lookups[i].subtables[0].substitute || lookups[i].subtables[0].deltaGlyphId) {
						var obj = lookups[i].subtables[0];
						obj.tag = feature.tag;
						subtablesSubs.push(obj);
						// lookuptype 3, Alternate Substitution Format 1
					} else if (lookups[i].subtables[0].alternateSets) {
						var _obj = lookups[i].subtables[0];
						_obj.tag = feature.tag;
						subtablesSubs.push(_obj);
						otherLookupTypes = true;
						// lookuptype 4, Ligature Substitution Format 1
					} else if (lookups[i].subtables[0].ligatureSets) {
						var _obj2 = lookups[i].subtables[0];
						_obj2.tag = feature.tag;
						subtablesLig.push(_obj2);
						// lookuptype 6, Chaining Contextual Substitution >> lookups[i].subtables[0].inputCoverage
					} else if (lookups[i].subtables[0].inputCoverage) {
						var _obj3 = lookups[i].subtables[0];
						_obj3.tag = feature.tag;
						subtablesSubs.push(_obj3);
						// lookuptype 7, Extension Substitution >> all subtables with ligatureSets and substitutes
					} else if (lookups[i].subtables[0].extension) {
						if (lookups[i].subtables[0].extension.ligatureSets) {
							var _obj4 = lookups[i].subtables[0].extension;
							_obj4.tag = feature.tag;
							subtablesLig.push(_obj4);
						} else if (lookups[i].subtables[0].extension.substitute || lookups[i].subtables[0].extension.deltaGlyphId) {
							var _obj5 = lookups[i].subtables[0].extension;
							_obj5.tag = feature.tag;
							subtablesSubs.push(_obj5);
						} else {
							return;
						}
						// check for the other lookuptypes we do not parse so far
						// lookuptype 2, Multiple Substitution
						// >>> https://github.com/opentypejs/opentype.js/pull/449
						// lookuptype 5, Contextual Substitution
						// lookuptype 8, Reverse Chaining Contextual
					} else if (lookups[i].lookupType === 2 || lookups[i].lookupType === 5 || lookups[i].lookupType === 8) {
						otherLookupTypes = true;
					}
				});
				//
				// }else{
				// 	return;
				// }
				//
			});
			this.set('otherLookups', otherLookupTypes);
			//
			// Make Ligatures Object
			var ligatureListObj = {};
			var ligatureListCount = 0;
			// pares subtables for ligatures
			subtablesLig.forEach(function (subtable) {
				// create object for every feature tag
				if (typeof ligatureListObj[subtable.tag] === 'undefined') {
					ligatureListObj[subtable.tag] = {};
					var featureName = otFeatureData.find(function (x) {
						return x.tag === subtable.tag;
					}); // get descriptive name for feature tag
					ligatureListObj[subtable.tag]['name'] = featureName;
					ligatureListObj[subtable.tag]['glyphlist'] = [];
				}
				if (subtable.coverage.format === 1) {
					subtable.ligatureSets.forEach(function (set, i) {
						set.forEach(function (ligature) {
							var coverage1 = subtable.coverage.glyphs[i];
							coverage1 = reverseGlyphIndexMap[coverage1];
							coverage1 = parseInt(coverage1);
							var components = ligature.components.map(function (component) {
								component = reverseGlyphIndexMap[component];
								component = parseInt(component);
								return String.fromCharCode(component);
							});
							var compLetters = String.fromCharCode(coverage1) + components.join('');
							var splitComp = compLetters.split(''); // to put the single letters in spans
							var ligName = glyphs[ligature.ligGlyph].name; // ligature glyph name
							// filter: check if checkComp does not exits already in object
							var checkDoublettes = ligatureListObj[subtable.tag]['glyphlist'].findIndex(function (x) {
								return x.checkComp === compLetters;
							});
							if (checkDoublettes === -1) {
								ligatureListObj[subtable.tag]['glyphlist'].push({
									checkComp: compLetters, // checkComp is for filtering only
									comp: splitComp,
									ligaG: ligature.ligGlyph,
									ligaName: ligName
								});
								ligatureListCount++;
							}
						});
					});
				} else {
					subtable.ligatureSets.forEach(function (set, i) {
						set.forEach(function (ligature) {
							var coverage2 = [];
							subtable.coverage.ranges.forEach(function (coverage) {
								for (var _i = coverage.start; _i <= coverage.end; _i++) {
									var character = reverseGlyphIndexMap[_i];
									character = parseInt(character);
									coverage2.push(String.fromCharCode(character));
								}
							});
							var components = ligature.components.map(function (component) {
								component = reverseGlyphIndexMap[component];
								component = parseInt(component);
								return String.fromCharCode(component);
							});
							var compLetters = coverage2[i] + components.join('');
							var splitComp = compLetters.split(''); // to put the single letters in spans
							var ligName = glyphs[ligature.ligGlyph].name;
							var checkDoublettes = ligatureListObj[subtable.tag]['glyphlist'].findIndex(function (x) {
								return x.checkComp === compLetters;
							});
							if (checkDoublettes === -1) {
								ligatureListObj[subtable.tag]['glyphlist'].push({
									checkComp: compLetters,
									comp: splitComp,
									ligaG: ligature.ligGlyph,
									ligaName: ligName
								});
								ligatureListCount++;
							}
						});
					});
				}
			});
			this.set('ligatureListNew', ligatureListObj); // Ligatures Object
			this.set('ligatureCount', ligatureListCount); // Ligatures Count
			this.set('ligatureFeaturesCount', Object.keys(ligatureListObj).length); // Count Features with Ligatures

			//
			// Make OT features substitutes Object
			var substituteListObj = {};
			// pares subtables for substitutes
			subtablesSubs.forEach(function (subtable) {
				// create object for every feature tag
				if (typeof substituteListObj[subtable.tag] === 'undefined') {
					substituteListObj[subtable.tag] = {};
					var featureName = otFeatureData.find(function (x) {
						return x.tag === subtable.tag;
					});
					substituteListObj[subtable.tag]['name'] = featureName;
					substituteListObj[subtable.tag]['glyphlist'] = [];
					substituteListObj[subtable.tag]['unique'] = [];
				}
				// lookuptype 6
				if (subtable.inputCoverage) {
					// make sequence from backtrackCoverage + inputCoverage + lookaheadCoverage
					var backtrackCov = [];
					var inputCov = [];
					var lookaheadCov = [];
					// backtrackCoverage
					subtable.backtrackCoverage.forEach(function (backtrack) {
						if (backtrack.glyphs) {
							var backtrackGlyphs = [];
							backtrack.glyphs.forEach(function (substitute, i) {
								var coverage = backtrack.glyphs[i];
								coverage = reverseGlyphIndexMap[coverage];
								coverage = parseInt(coverage);
								backtrackGlyphs.push(String.fromCharCode(coverage));
							});
							var backtrackFiltered = backtrackGlyphs.filter(String);
							backtrackCov.push.apply(backtrackCov, _toConsumableArray(backtrackFiltered));
						} else if (backtrack.ranges) {
							var rangesbacktrackCoverage = [];
							backtrack.ranges.forEach(function (coverage) {
								for (var i = coverage.start; i <= 100; i++) {
									// limited to 100 for better performance 
									var character = reverseGlyphIndexMap[i];
									character = parseInt(character);
									rangesbacktrackCoverage.push(String.fromCharCode(character));
								}
							});
							var backtrackFiltered2 = rangesbacktrackCoverage.filter(String);
							backtrackCov.push.apply(backtrackCov, _toConsumableArray(backtrackFiltered2));
						}
					});
					// inputCoverage
					subtable.inputCoverage.forEach(function (input) {
						if (input.glyphs) {
							var inputCoverageGlyphs = [];
							input.glyphs.forEach(function (substitute, i) {
								var coverage = input.glyphs[i];
								coverage = reverseGlyphIndexMap[coverage];
								coverage = parseInt(coverage);
								inputCoverageGlyphs.push(String.fromCharCode(coverage));
							});
							var inputFiltered = inputCoverageGlyphs.filter(String);
							inputCov.push.apply(inputCov, _toConsumableArray(inputFiltered));
						} else if (input.ranges) {
							var rangesInputCoverage = [];
							input.ranges.forEach(function (coverage) {
								for (var i = coverage.start; i <= 100; i++) {
									// limited to 100 for better performance 
									var character = reverseGlyphIndexMap[i];
									character = parseInt(character);
									rangesInputCoverage.push(String.fromCharCode(character));
								}
							});
							var inputFiltered2 = rangesInputCoverage.filter(String);
							inputCov.push.apply(inputCov, _toConsumableArray(inputFiltered2));
						}
					});
					// lookaheadCoverage
					subtable.lookaheadCoverage.forEach(function (lookahead) {
						if (lookahead.glyphs) {
							var lookaheadGlyphs = [];
							lookahead.glyphs.forEach(function (substitute, i) {
								var coverage = lookahead.glyphs[i];
								coverage = reverseGlyphIndexMap[coverage];
								coverage = parseInt(coverage);
								lookaheadGlyphs.push(String.fromCharCode(coverage));
							});
							var lookaheadFiltered = lookaheadGlyphs.filter(String);
							lookaheadCov.push.apply(lookaheadCov, _toConsumableArray(lookaheadFiltered));
						} else if (lookahead.ranges) {
							var rangesLookaheadCoverage = [];
							lookahead.ranges.forEach(function (coverage) {
								for (var i = coverage.start; i <= 100; i++) {
									// limited to 100 for better performance 
									var character = reverseGlyphIndexMap[i];
									character = parseInt(character);
									rangesLookaheadCoverage.push(String.fromCharCode(character));
								}
							});
							var lookaheadFiltered2 = rangesLookaheadCoverage.filter(String);
							lookaheadCov.push.apply(lookaheadCov, _toConsumableArray(lookaheadFiltered2));
						}
					});
					// make cartesian product of backtrackCov + inputCov + lookaheadCov
					var f = function f(a, b) {
						var _ref;

						return (_ref = []).concat.apply(_ref, _toConsumableArray(a.map(function (d) {
							return b.map(function (e) {
								return [].concat(d, e);
							});
						})));
					};
					var cartesian = function cartesian(a, b) {
						for (var _len = arguments.length, c = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
							c[_key - 2] = arguments[_key];
						}

						return b ? cartesian.apply(undefined, [f(a, b)].concat(c)) : a;
					};
					if (backtrackCov.length > 1 && lookaheadCov.length > 1) {
						var output = cartesian(backtrackCov, inputCov, lookaheadCov);
						output.forEach(function (sequenze) {
							substituteListObj[subtable.tag]['glyphlist'].push(sequenze.join(''));
						});
					} else if (backtrackCov.length > 1 && lookaheadCov.length < 1) {
						var _output = cartesian(backtrackCov, inputCov);
						_output.forEach(function (sequenze) {
							substituteListObj[subtable.tag]['glyphlist'].push(sequenze.join(''));
						});
					} else if (backtrackCov.length < 1 && lookaheadCov.length > 1) {
						var _output2 = cartesian(inputCov, lookaheadCov);
						_output2.forEach(function (sequenze) {
							substituteListObj[subtable.tag]['glyphlist'].push(sequenze.join(''));
						});
					}
					// lookuptype 1 & 7 glyphs
				} else if (subtable.coverage.glyphs) {
					var _substituteListObj$su;

					var substitutionGlyphs = [];
					// hier noch leere Zeichen rausfiltern & wenn vorhanden subOfsubs = true
					subtable.coverage.glyphs.forEach(function (substitute, i) {
						var coverage = subtable.coverage.glyphs[i];
						coverage = reverseGlyphIndexMap[coverage];
						coverage = parseInt(coverage);
						substitutionGlyphs.push(String.fromCharCode(coverage));
					});
					var filtered = substitutionGlyphs.filter(Boolean);
					(_substituteListObj$su = substituteListObj[subtable.tag]['glyphlist']).push.apply(_substituteListObj$su, _toConsumableArray(filtered));
					// lookuptype 1 & 7 ranges
				} else if (subtable.coverage.ranges) {
					var _substituteListObj$su2;

					var coverage2 = [];
					subtable.coverage.ranges.forEach(function (coverage) {
						for (var i = coverage.start; i <= coverage.end; i++) {
							var character = reverseGlyphIndexMap[i];
							character = parseInt(character);
							coverage2.push(String.fromCharCode(character));
						}
					});
					var filtered2 = coverage2.filter(Boolean);
					(_substituteListObj$su2 = substituteListObj[subtable.tag]['glyphlist']).push.apply(_substituteListObj$su2, _toConsumableArray(filtered2));

					// ToDO: lookuptype 3 !? alternateSetTable ?
				} else {
					return;
				}
			});
			// filter glyphlist for duplicates
			// imit glyphlist to 500 for better performance 
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.keys(substituteListObj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _substituteListObj$ke;

					var key = _step.value;

					var unique = [].concat(_toConsumableArray(new Set(substituteListObj[key].glyphlist))).slice(0, 500);
					(_substituteListObj$ke = substituteListObj[key].unique).push.apply(_substituteListObj$ke, _toConsumableArray(unique));
					// console.log('Länge '+unique.length);
				}
				// sort keys in subsitute object
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var substituteListObjSort = {};
			Object.keys(substituteListObj).sort().forEach(function (key) {
				substituteListObjSort[key] = substituteListObj[key];
			});

			this.set('substituteListNew', substituteListObjSort);
		},

		// GPOS features
		parseGPOS: function parseGPOS() {
			var gposFea = this.get('font.tables.gpos.features');
			var gposFeaList = [];
			gposFea.forEach(function (gpos) {
				if (!gposFeaList.includes(gpos.tag)) {
					gposFeaList.push(gpos.tag);
				}
			});
			this.set('gposFeatures', true);
			this.set('gposFeatureList', gposFeaList);
		},

		displayNames: function displayNames(names) {
			var html = '';
			var properties = this.sortKeys(names);
			for (var i = 0; i < properties.length; i++) {
				var property = properties[i];
				html += '<dt>' + this.escapeHtml(property) + '</dt><dd>';
				var translations = names[property];
				var langs = this.sortKeys(translations);
				for (var j = 0; j < langs.length; j++) {
					var lang = langs[j];
					var esclang = this.escapeHtml(lang);
					html += '<span class="langtag">' + esclang + '</span> <span class="langname" lang=' + esclang + '>' + this.escapeHtml(translations[lang]) + '</span> ';
					//html += '<span class="langtag">' + esclang + '</span> <span class="langname" lang=' + esclang + '></span> ';
				}
				html += '</dd>';
			}
			return html;
			//document.getElementById('name-table').innerHTML = html;
		},
		displayFontData: function displayFontData(font) {
			var html, tablename, table, property, value;
			var valMapFunc = function valMapFunc(item) {
				return JSON.stringify(item);
			};
			if (font.kerningPairs) {
				var elementKern = document.getElementById("kern-table");
				if (elementKern) {
					elementKern.innerHTML = '<dt>' + Object.keys(font.kerningPairs).length + ' Pairs</dt><dd>' + JSON.stringify(font.kerningPairs) + '</dd>';
				}
			}
			for (tablename in font.tables) {
				table = font.tables[tablename];
				html = '';
				if (tablename === 'name') {
					html = this.displayNames(table);
				} else {
					for (property in table) {
						value = table[property];
						html += '<dt>' + property + '</dt><dd>';
						if (Array.isArray(value) && _typeof(value[0]) === 'object') {
							html += value.map(valMapFunc).join('<br>');
						} else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
							html += JSON.stringify(value);
						} else if (['created', 'modified'].indexOf(property) > -1) {
							var date = new Date(value * 1000);
							html += date;
						} else {
							html += value;
						}
						html += '</dd>';
					}
				}
				var element = document.getElementById(tablename + "-table");
				if (element) {
					element.innerHTML = html;
				}
			}
		},
		getKerningPairs: function () {
			var font = this.get('font');
			var kerningPairs = Object.keys(font.kerningPairs).length;
			var gposKerning = font.getGposKerningValue ? 'yes' : 'no';
			if (kerningPairs !== 0) {
				document.getElementById("kerningPairs").innerHTML = ' and <span class="info-highlight">' + kerningPairs + '</span> binary stored kerning pairs';
			} else if (gposKerning === 'yes') {
				document.getElementById("kerningPairs").innerHTML = ' and a feature for <span class="info-highlight">Kerning</span>';
			}
		}.observes('font'),

		actions: {
			setSpecimen: function setSpecimen(id) {
				if (id === 100) {
					var sampleText = this.get('fontInfoSpecimenTexts');
					this.set('specimenText', sampleText);
					this.set('direction', 'ltr');
				} else {
					var result = this.get('specimenTexts').findBy('id', id);
					this.set('specimenText', result.sample);
					this.set('direction', result.direction);
				}
			},
			setWaterfall: function setWaterfall(id) {
				var result = this.get('waterfallTexts').findBy('id', id);
				this.set('waterfallLine', result.sample);
				this.set('waterfallDirection', result.direction);
			},
			updateWaterfallText: function updateWaterfallText(text) {
				this.set('waterfallLine', text);
			},
			updateFontSize: function updateFontSize(value) {
				this.set('typeYourselfFontSize', value);
			},
			updateLineHeight: function updateLineHeight(value) {
				this.set('typeYourselfLineHeight', value);
			}
		}
	});
});
define('fontdrop/components/font-languages', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	exports.default = Ember.Component.extend({

		classNames: ['languageDataArea'],
		fontLanguages: [],
		langLength: null,

		detectLanguage: function () {
			// Get unicode list from font
			var glyphs = this.get('font.glyphs.glyphs');
			var fontUniIndex = [];
			Object.keys(glyphs).forEach(function (key) {
				var val = glyphs[key]['unicodes'];
				if (val !== 'undefined' && val.length > 0) {
					fontUniIndex.push.apply(fontUniIndex, _toConsumableArray(val));
				}
			});
			var langData = this.get('languageData');
			var allLanguages = [];
			// Get langindex for languages and check if in fonts unicode list
			Object.keys(langData).forEach(function (key) {
				var langindex = langData[key]["langindex"];
				// Function for checkin if something matches
				var isSuperset = langindex.every(function (val) {
					return fontUniIndex.indexOf(val) >= 0;
				});

				var langName = langData[key]["name"];
				if (isSuperset === true) {
					allLanguages.push(langName);
				}
			});
			this.set('fontLanguages', allLanguages);
			//console.log("All detected languages in font: " + allLanguages);
		}.observes('font')

	});
});
define('fontdrop/components/font-otfeatures', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		classNames: ['otFeaturesArea'],

		otFeaDetected: [],
		feature: [],
		featureOn: [],
		featureOff: [],
		featureSettingsOn: [],
		featureSettingsOff: [],

		detectOT: function () {
			var zeroFeatures = [];
			this.set('otFeaDetected', zeroFeatures);
			// Get OT-Features from GSUB and GPOS table in font
			if (typeof this.get('font.tables.gsub') !== "undefined" || typeof this.get('font.tables.gpos') !== "undefined") {
				var parsedFeatures = [];
				if (typeof this.get('font.tables.gsub') !== "undefined") {
					// gsub
					var gsubFeatures = this.get('font.tables.gsub.features');
					Object.keys(gsubFeatures).forEach(function (key) {
						var val = { 'tag': gsubFeatures[key]["tag"] };
						parsedFeatures.push(val);
					});
				}if (typeof this.get('font.tables.gpos') !== "undefined") {
					// gpos
					var gposFeatures = this.get('font.tables.gpos.features');
					Object.keys(gposFeatures).forEach(function (key) {
						var val = { 'tag': gposFeatures[key]["tag"] };
						parsedFeatures.push(val);
					});
				}
				//
				//
				// New Approach
				// This will also keep the unknown and custom features!
				// Filter duplicates from parsedFeatures ...
				var parsedFeaUniq = parsedFeatures.filter(function (thing, index, self) {
					return index === self.findIndex(function (t) {
						return t.tag === thing.tag;
					});
				});

				// ... and add otFeatures database tag names and info
				// ToDO for wildcard features ss## and cv##
				var otFeatures = this.get('otFeatures');

				parsedFeaUniq.map(function (e) {
					var temp = otFeatures.find(function (element) {
						return element.tag === e.tag;
					});
					if (temp) {
						if (temp.name) {
							e.name = temp.name;
						} else {
							e.name = 'Custom Feature';
						}
						if (temp.desc) {
							e.desc = temp.desc;
						}
						if (temp.default) {
							e.default = temp.default;
						}
						if (temp.hide) {
							e.hide = temp.hide;
						}
						return e;
					}
				});
				// ... and remove features with hide=1 ...
				var parsedFeaUniqClean = parsedFeaUniq.filter(function (e) {
					return e.hide !== 1;
				});
				// ... and set default features On!
				var featuresOn = [];
				for (var i = 0; i < parsedFeaUniqClean.length; i++) {
					if (parsedFeaUniqClean[i].default === 1) {
						var fea = parsedFeaUniqClean[i].tag;
						featuresOn.push(fea);
					}
					this.set('featureOn', featuresOn);
				}
				// console.log('parsedFeaturesUniqClean');
				// console.log(parsedFeaUniqClean);

				this.set('otFeaDetected', parsedFeaUniqClean);
				this.featureSettings();
			}
		}.observes('font'),

		featureSettings: function featureSettings() {
			var featuresOn = this.get('featureOn');
			var featuresOff = this.get('featureOff');
			var featuresStyleOn = featuresOn.slice(0);
			var featuresStyleOff = featuresOff.slice(0);
			this.set('featureSettingsOn', null);
			this.set('featureSettingsOff', null);
			for (var on = 0; on < featuresStyleOn.length; on++) {
				featuresStyleOn[on] = '"' + featuresStyleOn[on] + '" on';
				this.set('featureSettingsOn', featuresStyleOn);
			}
			for (var off = 0; off < featuresStyleOff.length; off++) {
				featuresStyleOff[off] = '"' + featuresStyleOff[off] + '" off';
				this.set('featureSettingsOff', featuresStyleOff);
			}
			// console.log('featureSettingsOn: ' +featuresStyleOn);
			// console.log('featureSettingsOff: ' +featuresStyleOff);
		},


		actions: {
			switchOTfeature: function switchOTfeature(feature) {
				this.set('feature', feature);
				var featuresOn = this.get('featureOn');
				var featuresOff = this.get('featureOff');
				var on = featuresOn.indexOf(feature);
				var off = featuresOff.indexOf(feature);
				if (on === -1) {
					featuresOn.push(feature);
					featuresOff.splice(on, 1);
				} else if (off === -1) {
					featuresOff.push(feature);
					featuresOn.splice(on, 1);
				} else {
					featuresOn.push(feature);
				}
				this.featureSettings();
			}
		}
	});
});
define('fontdrop/components/font-preview', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({

        text: 'Hello World!',
        drawPoints: false,
        drawMetrics: false,
        fontSize: 96,
        kerning: true,

        watchText: function () {
            this.send("renderText");
        }.observes('text'),

        watchDrawPoints: function () {
            this.send("renderText");
        }.observes('drawPoints'),

        watchDrawMetrics: function () {
            this.send("renderText");
        }.observes('drawMetrics'),

        watchKerning: function () {
            this.send("renderText");
        }.observes('kerning'),

        watchFont: function () {
            this.send("renderText");
        }.observes('font'),

        actions: {
            renderText: function renderText() {
                var textToRender = this.get('text');
                var font = this.get('font');
                var previewCtx = document.getElementById('preview').getContext('2d');
                previewCtx.clearRect(0, 0, 940, 300);
                font.draw(previewCtx, textToRender, 0, 200, this.get('fontSize'), { kerning: this.get('kerning') });
                if (this.get('drawPoints')) {
                    font.drawPoints(previewCtx, textToRender, 0, 200, this.get('fontSize'), { kerning: this.get('kerning') });
                }
                if (this.get('drawMetrics')) {
                    font.drawMetrics(previewCtx, textToRender, 0, 200, this.get('fontSize'), { kerning: this.get('kerning') });
                }
            },
            updateFontSize: function updateFontSize(value) {
                this.set('fontSize', value);
                this.send("renderText");
            }
        }
    });
});
define('fontdrop/components/font-variable-font', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({

        classNames: ['variableFontArea'],
        classNameBindings: ['isActive:variableFontOn:variableFontOff'],
        isActive: false,
        isVariable: false,
        vfInstances: [],
        instancesCount: '0',

        variableFont: function () {
            var font = this.get('font');
            /* global VariableFont */
            var vf = new VariableFont(font);
            if (vf.getAxesCount()) {
                this.set('isVariable', true);
                this.set('isActive', true);
            } else {
                this.set('isVariable', false);
                this.set('isActive', false);
            }
            this.makeSlider(vf);
        }.observes('font'),

        makeSlider: function makeSlider(vf) {
            var currentSettings = [];
            var settingsStrings = [];
            var html;

            // if font is a variable font, add named instances dropdown and sliders
            if (vf.getAxesCount()) {

                html = '';

                // add slider controls for each axis
                html += '<div id="slidecontainer" class="small-12 large-6 columns">' + '<p>This is a <b>variable font</b> with ' + vf.getAxesCount() + ' axes. <span id="currentSetting" class="note"></span> </p><table>';
                for (var j = 0; j < vf.getAxesCount(); j++) {
                    var axis = vf.getAxis(j);
                    html += '<tr><td align="right">' + axis.minValue.toString() + '</td><td>' + '<input type="range" min="' + axis.minValue.toString() + '" max="' + axis.maxValue.toString() + '" value="' + axis.defaultValue.toString() + '" class="rslider" id="slider' + j.toString() + '" step="0.1"></td><td>' + axis.maxValue.toString() + '</td><td>' + axis.name.en + '</td></tr>';
                    currentSettings.push("'" + axis.tag + "' " + axis.defaultValue.toString());
                    settingsStrings.push(" " + axis.name.en + ": " + axis.defaultValue.toString());
                }
                html += '</table>';

                // add named instances to select        
                var getInstancesCount = vf.getInstancesCount();
                this.set('instancesCount', getInstancesCount);
                var allInstances = vf.getInstances(); // get instances field from fvar table.
                this.set('vfInstances', allInstances);

                var element = document.getElementById("variable-font-stuff");
                if (element) {
                    element.innerHTML = html;
                }
            } else {
                html = ' ';
                var emptyElement = document.getElementById("variable-font-stuff");
                if (emptyElement) {
                    emptyElement.innerHTML = html;
                }
            }

            // update the settings when any slider values change
            Ember.$('input[type=range]').on('input', function () {
                currentSettings = [];
                settingsStrings = [];
                for (var k = 0; k < vf.getAxesCount(); k++) {
                    var axis = vf.getAxis(k);
                    var theSlider = 'slider' + k.toString();
                    var styleElement = document.getElementById(theSlider);
                    currentSettings.push("'" + axis.tag + "' " + styleElement.value);
                    settingsStrings.push(" " + axis.name.en + ": " + styleElement.value);
                }
                if (vf.getAxesCount()) {
                    Ember.$("#currentSetting").text('Current: ' + settingsStrings.join());
                }
                Ember.$(".droppedFont").css('font-variation-settings', currentSettings.join());
            });
        },

        actions: {
            // apply the named instance settings to the sample text
            setNamedInstance: function setNamedInstance(id) {
                var font = this.get('font');
                var vf = new VariableFont(font);
                var vfInstance = this.get('vfInstances');
                var instanceNumber = vfInstance.findIndex(function (x) {
                    return x.name.en === id;
                });
                // console.log(instanceNumber);   
                var settings = vf.getNamedInstanceSetting(instanceNumber);
                Ember.$(".droppedFont").css('font-variation-settings', settings);
                Ember.$("#currentSetting").text('Current: ' + vf.getInstanceName(instanceNumber));
                // update the slider values
                var coords = vf.getNamedInstance(instanceNumber).coordinates;
                var i = 0;
                for (var tag in coords) {
                    //set slider value to coordinate string
                    Ember.$('#slider' + (i++).toString()).val(coords[tag].toString());
                }
            }
        }
    });
});
define('fontdrop/components/glyph-item-glyph', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        init: function init() {
            this._super();
            var index = this.get('index');
            this.set('elementId', 'g' + index);
            this.set('width', 250);
            this.set('height', 260);
        },


        didInsertElement: function didInsertElement() {
            this.renderGlyph();
        },

        tagName: 'canvas',
        width: 250,
        height: 260,
        attributeBindings: ['width', 'height'],

        renderGlyph: function renderGlyph() {
            var glyphIndex = this.get('index');
            var cellMarkSize = 8;
            var canvas = document.getElementById('g' + glyphIndex);
            var font = this.get('font');
            var cellWidth = this.get('width');
            var cellHeight = this.get('height');
            var fontScale,
                fontSize,
                fontBaseline,
                glyphSize,
                glyphBaseline,
                glyphMargin = 5;
            var head = font.tables.head,
                glyphW = cellWidth - glyphMargin * 2,
                glyphH = cellHeight - glyphMargin * 2,
                maxHeight = head.yMax - head.yMin;
            var glyphScale = Math.min(glyphW / (head.xMax - head.xMin), glyphH / maxHeight);
            glyphSize = glyphScale * font.unitsPerEm;
            glyphBaseline = glyphMargin + glyphH * head.yMax / maxHeight;
            fontScale = Math.min(cellWidth / (head.xMax - head.xMin), cellHeight / maxHeight);
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, cellWidth, cellHeight);
            if (glyphIndex >= font.numGlyphs) {
                return;
            }

            // styling of ...
            ctx.fillStyle = '#606060';
            ctx.font = '16px sans-serif';
            ctx.fillText(glyphIndex, 1, cellHeight - 1);
            var glyph = font.glyphs.get(glyphIndex),
                glyphWidth = glyph.advanceWidth * fontScale,
                xmin = (cellWidth - glyphWidth) / 2,
                xmax = (cellWidth + glyphWidth) / 2,
                x0 = xmin;

            // styling of ...
            ctx.fillStyle = '#a0a0a0';
            ctx.fillRect(xmin - cellMarkSize + 1, fontBaseline, cellMarkSize, 1);
            ctx.fillRect(xmin, fontBaseline, 1, cellMarkSize);
            ctx.fillRect(xmax, fontBaseline, cellMarkSize, 1);
            ctx.fillRect(xmax, fontBaseline, 1, cellMarkSize);

            // styling of ...
            ctx.fillStyle = '#000000';
            glyph.draw(ctx, x0, fontBaseline, fontSize);
            var pixelRatio = 1;
            var width = canvas.width / pixelRatio;
            var height = canvas.height / pixelRatio;
            ctx.clearRect(0, 0, width, height);
            if (glyphIndex < 0) {
                return;
            }
            var markSize = 10;

            // styling of metric values
            ctx.fillStyle = '#CCC';
            ctx.fillRect(xmin - markSize + 1, glyphBaseline, markSize, 1);
            ctx.fillRect(xmin, glyphBaseline, 1, markSize);
            ctx.fillRect(xmax, glyphBaseline, markSize, 1);
            ctx.fillRect(xmax, glyphBaseline, 1, markSize);
            ctx.textAlign = 'center';
            ctx.fillText('0', xmin, glyphBaseline + markSize + 10);
            ctx.fillText(glyph.advanceWidth, xmax, glyphBaseline + markSize + 10);

            // styling of the glyph
            ctx.fillStyle = '#000';
            var path = glyph.getPath(x0, glyphBaseline, glyphSize);
            path.fill = '#000';
            path.stroke = 'transparent';
            path.strokeWidth = 0;
            this.drawPathWithArrows(ctx, path);
            //glyph.drawPoints(ctx, x0, glyphBaseline, glyphSize);
        },

        drawPathWithArrows: function drawPathWithArrows(ctx, path) {
            //var _this = this;
            var i, cmd, x1, y1, x2, y2;
            var arrows = [];
            ctx.beginPath();
            for (i = 0; i < path.commands.length; i += 1) {
                cmd = path.commands[i];
                if (cmd.type === 'M') {
                    if (x1 !== undefined) {
                        arrows.push([ctx, x1, y1, x2, y2]);
                    }
                    ctx.moveTo(cmd.x, cmd.y);
                } else if (cmd.type === 'L') {
                    ctx.lineTo(cmd.x, cmd.y);
                    x1 = x2;
                    y1 = y2;
                } else if (cmd.type === 'C') {
                    ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                    x1 = cmd.x2;
                    y1 = cmd.y2;
                } else if (cmd.type === 'Q') {
                    ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
                    x1 = cmd.x1;
                    y1 = cmd.y1;
                } else if (cmd.type === 'Z') {
                    arrows.push([ctx, x1, y1, x2, y2]);
                    ctx.closePath();
                }
                x2 = cmd.x;
                y2 = cmd.y;
            }
            if (path.fill) {
                ctx.fillStyle = path.fill;
                ctx.fill();
            }
            if (path.stroke) {
                ctx.strokeStyle = path.stroke;
                ctx.lineWidth = path.strokeWidth;
                ctx.stroke();
            }
            ctx.fillStyle = '#000000';
        },
        watchFont: function () {
            this.renderGlyph();
        }.observes('font')
    });
});
define('fontdrop/components/glyph-item', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({

        classNames: ['glyphItem'],
        width: 500,
        height: 500,
        attributeBindings: ['width', 'height'],

        // get Foundation JS work
        didInsertElement: function didInsertElement() {
            this.$().foundation(); //or Ember.$(document).foundation();
        },

        drawPathWithArrows: function drawPathWithArrows(ctx, path) {
            var _this = this;
            var i, cmd, x1, y1, x2, y2;
            var arrows = [];
            ctx.beginPath();
            for (i = 0; i < path.commands.length; i += 1) {
                cmd = path.commands[i];
                if (cmd.type === 'M') {
                    if (x1 !== undefined) {
                        arrows.push([ctx, x1, y1, x2, y2]);
                    }
                    ctx.moveTo(cmd.x, cmd.y);
                } else if (cmd.type === 'L') {
                    ctx.lineTo(cmd.x, cmd.y);
                    x1 = x2;
                    y1 = y2;
                } else if (cmd.type === 'C') {
                    ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                    x1 = cmd.x2;
                    y1 = cmd.y2;
                } else if (cmd.type === 'Q') {
                    ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
                    x1 = cmd.x1;
                    y1 = cmd.y1;
                } else if (cmd.type === 'Z') {
                    arrows.push([ctx, x1, y1, x2, y2]);
                    ctx.closePath();
                }
                x2 = cmd.x;
                y2 = cmd.y;
            }
            if (path.fill) {
                ctx.fillStyle = path.fill;
                ctx.fill();
            }
            if (path.stroke) {
                ctx.strokeStyle = path.stroke;
                ctx.lineWidth = path.strokeWidth;
                ctx.stroke();
            }
            ctx.fillStyle = '#000000';
            arrows.forEach(function (arrow) {
                _this.drawArrow.apply(null, arrow);
            });
        },

        drawArrow: function drawArrow(ctx, x1, y1, x2, y2) {
            var arrowLength = 10,
                arrowAperture = 4;
            var dx = x2 - x1,
                dy = y2 - y1,
                segmentLength = Math.sqrt(dx * dx + dy * dy),
                unitx = dx / segmentLength,
                unity = dy / segmentLength,
                basex = x2 - arrowLength * unitx,
                basey = y2 - arrowLength * unity,
                normalx = arrowAperture * unity,
                normaly = -arrowAperture * unitx;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(basex + normalx, basey + normaly);
            ctx.lineTo(basex - normalx, basey - normaly);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.fill();
        },

        renderGlyph: function renderGlyph() {
            var glyphIndex = this.get('index');
            var cellMarkSize = 4;
            var canvas = document.getElementById('glyph-detail');
            var font = this.get('font');
            var cellWidth = this.get('width');
            var cellHeight = this.get('height');
            var fontScale,
                fontSize,
                fontBaseline,
                glyphSize,
                glyphBaseline,
                glyphMargin = 5;
            var head = font.tables.head,
                glyphW = cellWidth - glyphMargin * 2,
                glyphH = cellHeight - glyphMargin * 2,
                maxHeight = head.yMax - head.yMin;
            var glyphScale = Math.min(glyphW / (head.xMax - head.xMin), glyphH / maxHeight);
            glyphSize = glyphScale * font.unitsPerEm;
            glyphBaseline = glyphMargin + glyphH * head.yMax / maxHeight;
            fontScale = Math.min(cellWidth / (head.xMax - head.xMin), cellHeight / maxHeight);
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, cellWidth, cellHeight);
            if (glyphIndex >= font.numGlyphs) {
                return;
            }

            // styling of ...
            ctx.fillStyle = '#000';
            ctx.font = '11px sans-serif';
            ctx.fillText(glyphIndex, 1, cellHeight - 1);
            var glyph = font.glyphs.get(glyphIndex),
                glyphWidth = glyph.advanceWidth * fontScale,
                xmin = (cellWidth - glyphWidth) / 2,
                xmax = (cellWidth + glyphWidth) / 2,
                x0 = xmin;

            // styling of ...
            ctx.fillStyle = '#000';
            ctx.fillRect(xmin - cellMarkSize + 1, fontBaseline, cellMarkSize, 1);
            ctx.fillRect(xmin, fontBaseline, 1, cellMarkSize);
            ctx.fillRect(xmax, fontBaseline, cellMarkSize, 1);
            ctx.fillRect(xmax, fontBaseline, 1, cellMarkSize);

            // styling of ...
            ctx.fillStyle = '#000';
            glyph.draw(ctx, x0, fontBaseline, fontSize);
            var pixelRatio = 1;
            var width = canvas.width / pixelRatio;
            var height = canvas.height / pixelRatio;
            ctx.clearRect(0, 0, width, height);
            if (glyphIndex < 0) {
                return;
            }
            var markSize = 10;

            // draw horizontal metric lines
            function hline(text, yunits) {
                var ypx = glyphBaseline - yunits * glyphScale;
                ctx.fillText(text, 2, ypx + 3);
                ctx.fillRect(70, ypx, width, 1);
            }
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#e1e1e1';
            hline('Baseline', 0); // Baseline
            // hline('yMax', font.tables.head.yMax); //yMax
            // hline('yMin', font.tables.head.yMin); //yMin
            hline('Ascender', font.tables.hhea.ascender); // Ascender
            hline('Descender', font.tables.hhea.descender); // Desender
            // hline('', font.tables.os2.sTypoAscender); // Typo Ascender
            // hline('', font.tables.os2.sTypoDescender); // Typo Descender
            hline('x-Height', font.tables.os2.sxHeight); // x-Height
            hline('Caps', font.tables.os2.sCapHeight); // Caps Height

            // styling of metric values
            ctx.fillStyle = '#999999';
            ctx.fillRect(xmin - markSize + 1, glyphBaseline, markSize, 1);
            ctx.fillRect(xmin, glyphBaseline, 1, markSize);
            ctx.fillRect(xmax, glyphBaseline, markSize, 1);
            ctx.fillRect(xmax, glyphBaseline, 1, markSize);
            ctx.textAlign = 'center';
            ctx.fillText('1', xmin, glyphBaseline + markSize + 10);
            ctx.fillText(glyph.advanceWidth, xmax, glyphBaseline + markSize + 10);

            // styling of the glyph
            ctx.fillStyle = '#000';
            var path = glyph.getPath(x0, glyphBaseline, glyphSize);
            // color of glyph fill
            path.fill = '#e1e1e1';
            // color of glyph contour
            path.stroke = '#840084';
            path.strokeWidth = 1;
            this.drawPathWithArrows(ctx, path);
            glyph.drawPoints(ctx, x0, glyphBaseline, glyphSize);
        },

        displayGlyphData: function displayGlyphData() {
            var glyphIndex = this.get('index');
            var container = document.getElementById('glyph-item-data');
            var font = this.get('font');
            if (glyphIndex < 0) {
                container.innerHTML = '';
                return;
            }
            var glyph = font.glyphs.get(glyphIndex),
                html = '<dl>';
            html += '<dt>name</dt><dd>' + glyph.name + '</dd>';
            if (glyph.unicodes.length > 0) {
                var theUnicode = glyph.unicodes.map(function (unicode) {
                    unicode = unicode.toString(16);
                    if (unicode.length > 4) {
                        return ("000000" + unicode.toUpperCase()).substr(-6);
                    } else {
                        return ("0000" + unicode.toUpperCase()).substr(-4);
                    }
                }).join(', ');
                // add search for Unicode on Ecosia ↗
                html += '<dt>unicode</dt><dd>' + theUnicode + ' <a href="https://www.ecosia.org/search?method=index&q=unicode ' + theUnicode + '" title="Search for Unicode on Ecosia" target="_blank" rel="noopener">↗</a> ';
                html += '</dd>';
            }
            html += '<dt>index</dt><dd>' + glyph.index + '</dd>';
            if (glyph.xMin !== 0 || glyph.xMax !== 0 || glyph.yMin !== 0 || glyph.yMax !== 0) {
                html += '<dt>xMin</dt><dd>' + glyph.xMin + '</dd>' + '<dt>xMax</dt><dd>' + glyph.xMax + '</dd>' + '<dt>yMin</dt><dd>' + glyph.yMin + '</dd>' + '<dt>yMax</dt><dd>' + glyph.yMax + '</dd>';
            }
            html += '<dt>advanceWidth</dt><dd>' + glyph.advanceWidth + '</dd>';
            if (glyph.leftSideBearing !== undefined) {
                html += '<dt>leftSideBearing</dt><dd>' + glyph.leftSideBearing + '</dd>';
            }
            html += '</dl>';
            if (glyph.numberOfContours > 0) {
                var contours = glyph.getContours();
                html += '<span>Contours data</span><div id="glyph-contours">' + contours.map(function (contour) {
                    return '<pre class="contour">' + contour.map(function (point) {
                        return '<span class="' + (point.onCurve ? 'on' : 'off') + 'curve">x=' + point.x + ' y=' + point.y + '</span>';
                    }).join('\n') + '</pre>';
                }).join('\n') + '</div>';
            } else if (glyph.isComposite) {
                html += '<br/><span>This composite glyph is a combination of :</span><br/><ul><li>' + glyph.components.map(function (component) {
                    if (component.matchedPoints === undefined) {
                        return 'glyph ' + component.glyphIndex + ' at dx=' + component.dx + ', dy=' + component.dy;
                    } else {
                        return 'glyph ' + component.glyphIndex + ' at matchedPoints=[' + component.matchedPoints + ']';
                    }
                }).join('</li><li>') + '</li></ul>';
            } else if (glyph.path) {
                html += '<spn>Path data</span><br/><pre>  ' + glyph.path.commands.map(function (cmd) {
                    var str = '<strong>' + cmd.type + '</strong> ' + (cmd.x !== undefined ? 'x=' + cmd.x + ' y=' + cmd.y + ' ' : '') + (cmd.x1 !== undefined ? 'x1=' + cmd.x1 + ' y1=' + cmd.y1 + ' ' : '') + (cmd.x2 !== undefined ? 'x2=' + cmd.x2 + ' y2=' + cmd.y2 : '');
                    return str;
                }).join('\n  ') + '\n</pre>';
            }

            container.innerHTML = html;
        },

        click: function click(e) {
            e.preventDefault();
            this.renderGlyph();
            this.displayGlyphData();
            Ember.$('#glyphModal').foundation('reveal', 'open');
        }

    });
});
define('fontdrop/components/highlight-bar', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		showBanner: 'showHighlight',

		actions: {
			highlightBanner: function highlightBanner() {
				this.set('showBanner', 'hideHighlight');
			}
		}

	});
});
define('fontdrop/components/info-modal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({

    elementId: 'info-button',

    // get Foundation JS work
    didInsertElement: function didInsertElement() {
      this.$().foundation(); //or Ember.$(document).foundation(); 
    }

  });
});
define('fontdrop/components/languages-details', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	exports.default = Ember.Component.extend({

		classNames: ['languageReport'],
		fontLanguages: [],
		fontLanguagesArray: [],
		fontUniIndex: [],

		didInsertElement: function didInsertElement() {
			this.$().foundation(); //or Ember.$(document).foundation();
		},


		detectLanguage: function () {
			// Get unicode list from font
			var glyphs = this.get('fontOne.glyphs.glyphs');
			var fontUniIndex = [];
			Object.keys(glyphs).forEach(function (key) {
				var val = glyphs[key]['unicodes'];
				if (val !== 'undefined' && val.length > 0) {
					fontUniIndex.push.apply(fontUniIndex, _toConsumableArray(val));
				}
			});
			var langData = this.get('languageData');
			var allLanguagesData = [];
			var allLanguagesArray = [];

			// Get langindex for languages and check if in fonts unicode list
			Object.keys(langData).forEach(function (key) {
				var langindex = langData[key]["langindex"];
				// Function for checkin if something matches
				var isSuperset = langindex.every(function (val) {
					return fontUniIndex.indexOf(val) >= 0;
				});

				if (isSuperset === true) {
					allLanguagesData.push(langData[key]);
					allLanguagesArray.push(langData[key]["name"]);
				}
			});
			this.set('fontLanguages', allLanguagesData);
			this.set('fontLanguagesArray', allLanguagesArray);
			this.set('fontUniIndex', fontUniIndex);
		}.observes('fontOne'),

		actions: {
			scrollTo: function scrollTo(anchor) {
				// Leerzeichen und Sonderzeichen rausnehmen ...
				// anchor.replace(/[^A-Z0-9]/ig, "");
				var elem = '#' + anchor.replace(/[^A-Z0-9]/ig, "");
				document.querySelector(elem).scrollIntoView({
					behavior: 'smooth'
				});
			},
			scrollToDatabase: function scrollToDatabase(anchor) {
				var elem = '#database-' + anchor.replace(/[^A-Z0-9]/ig, "");
				document.querySelector(elem).scrollIntoView({
					behavior: 'smooth'
				});
			}
		}

	});
});
define('fontdrop/components/ligature-item', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        init: function init() {
            this._super();
            this.set('width', 250);
            this.set('height', 260);
        },


        didInsertElement: function didInsertElement() {
            this.renderLigature();
        },

        tagName: 'canvas',
        width: 250,
        height: 260,
        attributeBindings: ['width', 'height'],

        renderLigature: function () {
            var glyphIndex = this.get('glyphindex');
            var cellMarkSize = 8;
            var canvas = document.getElementById(this.elementId);
            var font = this.get('font');
            var cellWidth = this.get('width');
            var cellHeight = this.get('height');
            var fontScale,
                fontSize,
                fontBaseline,
                glyphSize,
                glyphBaseline,
                glyphMargin = 5;
            var head = font.tables.head,
                glyphW = cellWidth - glyphMargin * 2,
                glyphH = cellHeight - glyphMargin * 2,
                maxHeight = head.yMax - head.yMin;
            var glyphScale = Math.min(glyphW / (head.xMax - head.xMin), glyphH / maxHeight);
            glyphSize = glyphScale * font.unitsPerEm;
            glyphBaseline = glyphMargin + glyphH * head.yMax / maxHeight;
            fontScale = Math.min(cellWidth / (head.xMax - head.xMin), cellHeight / maxHeight);
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, cellWidth, cellHeight);
            if (glyphIndex >= font.numGlyphs) {
                return;
            }

            // styling of ...
            ctx.fillStyle = '#606060';
            ctx.font = '16px sans-serif';
            ctx.fillText(glyphIndex, 1, cellHeight - 1);
            var glyph = font.glyphs.get(glyphIndex),
                glyphWidth = glyph.advanceWidth * fontScale,
                xmin = (cellWidth - glyphWidth) / 2,
                xmax = (cellWidth + glyphWidth) / 2,
                x0 = xmin;

            // styling of ...
            ctx.fillStyle = '#a0a0a0';
            ctx.fillRect(xmin - cellMarkSize + 1, fontBaseline, cellMarkSize, 1);
            ctx.fillRect(xmin, fontBaseline, 1, cellMarkSize);
            ctx.fillRect(xmax, fontBaseline, cellMarkSize, 1);
            ctx.fillRect(xmax, fontBaseline, 1, cellMarkSize);

            // styling of ...
            ctx.fillStyle = '#000000';
            glyph.draw(ctx, x0, fontBaseline, fontSize);
            var pixelRatio = 1;
            var width = canvas.width / pixelRatio;
            var height = canvas.height / pixelRatio;
            ctx.clearRect(0, 0, width, height);
            if (glyphIndex < 0) {
                return;
            }
            var markSize = 10;

            // styling of metric values
            ctx.fillStyle = '#CCC';
            ctx.fillRect(xmin - markSize + 1, glyphBaseline, markSize, 1);
            ctx.fillRect(xmin, glyphBaseline, 1, markSize);
            ctx.fillRect(xmax, glyphBaseline, markSize, 1);
            ctx.fillRect(xmax, glyphBaseline, 1, markSize);
            ctx.textAlign = 'center';
            ctx.fillText('0', xmin, glyphBaseline + markSize + 10);
            ctx.fillText(glyph.advanceWidth, xmax, glyphBaseline + markSize + 10);

            // styling of the glyph
            ctx.fillStyle = '#000';
            var path = glyph.getPath(x0, glyphBaseline, glyphSize);
            path.fill = '#000';
            path.stroke = 'transparent';
            path.strokeWidth = 0;
            this.drawPath(ctx, path);
            //glyph.drawPoints(ctx, x0, glyphBaseline, glyphSize);
        }.observes('font'),

        drawPath: function drawPath(ctx, path) {
            //var _this = this;
            var i, cmd, x1, y1, x2, y2;
            var arrows = [];
            ctx.beginPath();
            for (i = 0; i < path.commands.length; i += 1) {
                cmd = path.commands[i];
                if (cmd.type === 'M') {
                    if (x1 !== undefined) {
                        arrows.push([ctx, x1, y1, x2, y2]);
                    }
                    ctx.moveTo(cmd.x, cmd.y);
                } else if (cmd.type === 'L') {
                    ctx.lineTo(cmd.x, cmd.y);
                    x1 = x2;
                    y1 = y2;
                } else if (cmd.type === 'C') {
                    ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                    x1 = cmd.x2;
                    y1 = cmd.y2;
                } else if (cmd.type === 'Q') {
                    ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
                    x1 = cmd.x1;
                    y1 = cmd.y1;
                } else if (cmd.type === 'Z') {
                    arrows.push([ctx, x1, y1, x2, y2]);
                    ctx.closePath();
                }
                x2 = cmd.x;
                y2 = cmd.y;
            }
            if (path.fill) {
                ctx.fillStyle = path.fill;
                ctx.fill();
            }
            if (path.stroke) {
                ctx.strokeStyle = path.stroke;
                ctx.lineWidth = path.strokeWidth;
                ctx.stroke();
            }
            ctx.fillStyle = '#000000';
        }

    });
});
define('fontdrop/components/loading-slider', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var Component = Ember.Component,
      run = Ember.run,
      isBlank = Ember.isBlank,
      inject = Ember.inject,
      on = Ember.on;
  exports.default = Component.extend({
    tagName: 'div',
    classNames: ['loading-slider'],
    classNameBindings: 'expanding',
    progressBarClass: null,

    loadingSlider: inject.service(),

    init: function init() {
      this._super.apply(this, arguments);

      if (isFastBoot()) {
        return;
      }

      run.once(this, function () {
        this.get('loadingSlider').on('startLoading', this, this._startLoading);
        this.get('loadingSlider').on('endLoading', this, this._endLoading);
        this.get('loadingSlider').on('changeAttrs', this, this._changeAttrs);
      });
    },


    setAttrsThenManage: on('didReceiveAttrs', function () {

      if (isFastBoot()) {
        return;
      }

      this.setProperties({
        isLoading: this.getAttr('isLoading'),
        duration: this.getAttr('duration'),
        expanding: this.getAttr('expanding'),
        speed: this.getAttr('speed'),
        color: this.getAttr('color')
      });

      this.manage();
    }),

    willDestroy: function willDestroy() {
      run.once(this, function () {
        this.get('loadingSlider').off('startLoading', this, this._startLoading);
        this.get('loadingSlider').off('endLoading', this, this._endLoading);
        this.get('loadingSlider').off('changeAttrs', this, this._changeAttrs);
      });
    },
    _startLoading: function _startLoading() {
      this.set('isLoading', true);
      this.manage();
    },
    _endLoading: function _endLoading() {
      this.set('isLoading', false);
    },
    _changeAttrs: function _changeAttrs(attrs) {
      this.setProperties(attrs);
      this.manage();
    },
    manage: function manage() {
      if (isBlank(this.$())) {
        return;
      }

      if (this.get('isLoading')) {
        if (this.get('expanding')) {
          this.expandingAnimate.call(this);
        } else {
          this.animate.call(this);
        }
      } else {
        this.set('isLoaded', true);
      }
    },
    animate: function animate() {
      this.set('isLoaded', false);
      var self = this,
          elapsedTime = 0,
          inner = $('<span class="loading-slider__progress ' + this.get('progressBarClass') + '">'),
          outer = this.$(),
          duration = this.getWithDefault('duration', 300),
          innerWidth = 0,
          outerWidth = this.$().width(),
          stepWidth = Math.round(outerWidth / 50),
          color = this.get('color');

      outer.append(inner);
      if (color) {
        inner.css('background-color', color);
      }

      var interval = window.setInterval(function () {
        elapsedTime = elapsedTime + 10;
        inner.width(innerWidth = innerWidth + stepWidth);

        // slow the animation if we used more than 75% the estimated duration
        // or 66% of the animation width
        if (elapsedTime > duration * 0.75 || innerWidth > outerWidth * 0.66) {
          // don't stop the animation completely
          if (stepWidth > 1) {
            stepWidth = stepWidth * 0.97;
          }
        }

        if (innerWidth > outerWidth) {
          run.later(function () {
            outer.empty();
            window.clearInterval(interval);
          }, 50);
        }

        // the activity has finished
        if (self.get('isLoaded')) {
          // start with a sizable pixel step
          if (stepWidth < 10) {
            stepWidth = 10;
          }
          // accelerate to completion
          stepWidth = stepWidth + stepWidth;
        }
      }, 10);
    },
    expandingAnimate: function expandingAnimate() {
      var self = this,
          outer = this.$(),
          speed = this.getWithDefault('speed', 1000),
          colorQueue = this.get('color');

      if ('object' === (typeof colorQueue === 'undefined' ? 'undefined' : _typeof(colorQueue))) {
        (function updateFn() {
          if (self.isDestroyed || self.isDestroying) {
            return;
          }
          var color = colorQueue.shift();
          colorQueue.push(color);
          self.expandItem.call(self, color);
          if (!self.get('isLoading')) {
            outer.empty();
          } else {
            window.setTimeout(updateFn, speed);
          }
        })();
      } else {
        this.expandItem.call(this, colorQueue, true);
      }
    },
    expandItem: function expandItem(color, cleanUp) {
      var self = this,
          inner = $('<span>').css({ 'background-color': color }),
          outer = this.$(),
          innerWidth = 0,
          outerWidth = outer.width(),
          stepWidth = Math.round(outerWidth / 50);
      var ua = window.navigator.userAgent;
      var ie10 = ua.indexOf("MSIE "),
          ie11 = ua.indexOf('Trident/'),
          ieEdge = ua.indexOf('Edge/');

      outer.append(inner);

      var interval = window.setInterval(function () {
        var step = innerWidth = innerWidth + stepWidth;
        if (innerWidth > outerWidth) {
          window.clearInterval(interval);
          if (cleanUp) {
            outer.empty();
          }
        }
        if (ie10 > 0 || ie11 > 0 || ieEdge > 0) {
          inner.css({
            'margin': '0 auto',
            'width': step
          });
        } else {
          inner.css({
            'margin-left': '-' + step / 2 + 'px',
            'width': step
          });
        }
      }, 10);
    },
    didInsertElement: function didInsertElement() {
      this.$().html('<span>');

      var color = this.get('color');
      if (color) {
        this.$('span').css('background-color', color);
      }

      if (this.get('runManageInitially')) {
        this._startLoading();
      }
    }
  });


  function isFastBoot() {
    return typeof FastBoot !== 'undefined';
  }
});
define('fontdrop/components/popover-on-component', ['exports', 'ember-tooltips/components/popover-on-component'], function (exports, _popoverOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _popoverOnComponent.default;
    }
  });
});
define('fontdrop/components/popover-on-element', ['exports', 'ember-tooltips/components/popover-on-element'], function (exports, _popoverOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _popoverOnElement.default;
    }
  });
});
define('fontdrop/components/read-more', ['exports', 'ember-read-more/components/read-more'], function (exports, _readMore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _readMore.default;
    }
  });
});
define('fontdrop/components/scroll-to-top', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({

		scrollToTop: function () {
			Ember.run.scheduleOnce('afterRender', this, function () {

				this.$("#scroll-to-top").hide();

				this.$(window).scroll(function () {
					if (this.$(this).scrollTop() > 200) {
						this.$('#scroll-to-top').fadeIn('slow');
					} else {
						this.$('#scroll-to-top').fadeOut('slow');
					}
				});
			});
		}.on('didInsertElement'),

		willDestroyElement: function willDestroyElement() {
			//remove handlers like this.$().off(...)
		},

		actions: {
			toTop: function toTop() {
				Ember.$(window).scrollTop(0);
			}
		}

	});
});
define('fontdrop/components/scroll-to', ['exports', 'ember-scroll-to/components/scroll-to'], function (exports, _scrollTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _scrollTo.default;
});
define('fontdrop/components/sticky-element', ['exports', 'ember-sticky-element/components/sticky-element'], function (exports, _stickyElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _stickyElement.default;
    }
  });
});
define('fontdrop/components/sticky-element/trigger', ['exports', 'ember-sticky-element/components/sticky-element/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _trigger.default;
    }
  });
});
define('fontdrop/components/tether-popover-on-component', ['exports', 'ember-tooltips/components/tether-popover-on-component'], function (exports, _tetherPopoverOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherPopoverOnComponent.default;
    }
  });
});
define('fontdrop/components/tether-popover-on-element', ['exports', 'ember-tooltips/components/tether-popover-on-element'], function (exports, _tetherPopoverOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherPopoverOnElement.default;
    }
  });
});
define('fontdrop/components/tether-tooltip-on-component', ['exports', 'ember-tooltips/components/tether-tooltip-on-component'], function (exports, _tetherTooltipOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherTooltipOnComponent.default;
    }
  });
});
define('fontdrop/components/tether-tooltip-on-element', ['exports', 'ember-tooltips/components/tether-tooltip-on-element'], function (exports, _tetherTooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherTooltipOnElement.default;
    }
  });
});
define('fontdrop/components/tooltip-on-component', ['exports', 'ember-tooltips/components/tooltip-on-component'], function (exports, _tooltipOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tooltipOnComponent.default;
    }
  });
});
define('fontdrop/components/tooltip-on-element', ['exports', 'fontdrop/config/environment', 'ember-tooltips/components/tooltip-on-element'], function (exports, _environment, _tooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var _didUpdateTimeoutLength = _environment.default.environment === 'test' ? 0 : 1000;

  exports.default = _tooltipOnElement.default.extend({ _didUpdateTimeoutLength: _didUpdateTimeoutLength });
});
define('fontdrop/components/x-range-input', ['exports', 'emberx-range-input/components/x-range-input'], function (exports, _xRangeInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _xRangeInput.default;
});
define('fontdrop/controllers/application', ['exports', 'fontdrop/statics/otFeatures', 'fontdrop/statics/languageData'], function (exports, _otFeatures, _languageData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        elementId: 'fontDropApp',
        queryParams: ['darkmode'],
        darkmode: false,

        init: function init() {
            this._super();

            this.set('otFeatures', _otFeatures.default.otFeatures);
            this.set('languageData', _languageData.default.languageData);

            Ember.run.next(this, function () {
                Ember.$('body > .ember-view').addClass('fontdrop-app');
                // Dark Mode Query
                // firstcheck if browser or OS has prefers-color-scheme: dark
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.set('darkmode', true);
                }
                if (this.get('darkmode') === true) {
                    document.getElementById("fontDropBody").classList.add('dark');
                }
            });
        },

        actions: {
            darkmode: function darkmode() {
                if (this.get('darkmode') === false) {
                    this.set('darkmode', true);
                    document.getElementById("fontDropBody").classList.remove('light-mode');
                    document.getElementById("fontDropBody").classList.add('dark');
                } else if (this.get('darkmode') === true) {
                    this.set('darkmode', false);
                    document.getElementById("fontDropBody").classList.remove('dark');
                    document.getElementById("fontDropBody").classList.add('light-mode');
                }
            }
        }

    });
});
define('fontdrop/controllers/compare', ['exports', 'fontdrop/statics/compareTexts', 'fontdrop/statics/waterfallTexts'], function (exports, _compareTexts, _waterfallTexts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        application: Ember.inject.controller(),

        fontOne: null,

        init: function init() {
            this.set('compareTexts', _compareTexts.default.compareTexts);
            this.set('waterfallTexts', _waterfallTexts.default.waterfallTexts);
        },

        actions: {
            changeFontOne: function changeFontOne(fontOne) {
                this.set('fontOne', fontOne);
            }
        }

    });
});
define('fontdrop/controllers/index', ['exports', 'fontdrop/statics/otFeatures', 'fontdrop/statics/languageData', 'fontdrop/statics/waterfallTexts'], function (exports, _otFeatures, _languageData, _waterfallTexts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        application: Ember.inject.controller(),

        queryParams: ['funfont'],
        funfont: null,
        fontFile: 'fonts/Rethink-Regular.otf',
        font: null,

        init: function init() {

            this.set('otFeatures', _otFeatures.default.otFeatures);
            this.set('languageData', _languageData.default.languageData);
            this.set('waterfallTexts', _waterfallTexts.default.waterfallTexts);

            Ember.run.next(this, function () {
                // Fun Font Query
                if (this.get('funfont')) {
                    var funfont = this.get('funfont');
                    var allFunFonts = this.get('funFonts');
                    var funfontFile = allFunFonts.find(function (x) {
                        return x.fontName === funfont;
                    }).fontPath;
                    this.set('fontFile', funfontFile);
                    document.getElementById("uploadedFont").innerHTML = '<style>' + '@font-face{' + 'font-family: preview;' + 'src: url(' + funfontFile + ');' + '}' + '.droppedFont {font-family: preview, AdobeBlank;}' + '#font-name .droppedFont {font-family: preview, AttributeFaux, AdobeBlank;}' + '</style>';

                    this.initFontLoad();
                } else {
                    this.initFontLoad();
                }
            });

            // Fun With Fonts files
            this.set('funFonts', [{ fontName: "Vestmar", fontPath: "fonts/fun-with-fonts/VestmarVariable.ttf" }, { fontName: "NouvelleVague", fontPath: "fonts/fun-with-fonts/NouvelleVague.otf" }, { fontName: "Buchstabenmuseum", fontPath: "fonts/fun-with-fonts/Buchstabenmuseum_Schrift.otf" }, { fontName: "Arapix", fontPath: "fonts/fun-with-fonts/29LTArapix-Regular.otf" }, { fontName: "Babetta", fontPath: "fonts/babetta-regular-webfont.woff" }, { fontName: "ViaodaLibre", fontPath: "fonts/fun-with-fonts/ViaodaLibre-Regular.ttf" }, { fontName: "KommuneInline", fontPath: "fonts/fun-with-fonts/KommuneInline-Regular.otf" }, { fontName: "Icons", fontPath: "fonts/fun-with-fonts/MaterialIcons-Regular.ttf" }, { fontName: "Chikki", fontPath: "fonts/fun-with-fonts/Chikki-Regular.otf" }, { fontName: "WHOA", fontPath: "fonts/fun-with-fonts/WHOA-Variable-Spine-v0_3.ttf" }, { fontName: "Apparat", fontPath: "fonts/fun-with-fonts/ApparatSemiCond-Heavy.woff" }, { fontName: "funt", fontPath: "fonts/fun-with-fonts/AnUnfinishedFunt-OpenLine.otf" }]);
        },

        initFontLoad: function initFontLoad() {
            var c = this,
                file = c.get('fontFile');
            /* global opentype */
            opentype.load(file, function (err, font) {
                if (err) {
                    alert('Font could not be loaded: ' + err);
                } else {
                    // var ctx = document.getElementById('fontName').getContext('2d');
                    // Construct a Path object containing the letter shapes of the given text.
                    // The other parameters are x, y and fontSize.
                    // Note that y is the position of the baseline.
                    // var path = font.getPath(font.names.fontFamily.en, 0, 200, c.get('fontSize'));
                    // If you just want to draw the text you can also use font.draw(ctx, text, x, y, fontSize).
                    // path.draw(ctx);
                    c.set('font', font);
                    //console.log("Font name is: " + font.names.fontFamily.en);
                    //console.log(font);
                }
            });
        },

        actions: {
            changeFont: function changeFont(font) {
                //console.log('changeFont')
                //this.set('font',null);
                this.set('font', font);
                //console.log(this.get('font'))
            }
        }

    });
});
define('fontdrop/controllers/languages', ['exports', 'fontdrop/statics/languageData'], function (exports, _languageData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        application: Ember.inject.controller(),

        fontOne: null,

        init: function init() {
            this.set('languageData', _languageData.default.languageData);
        },

        actions: {
            changeFontOne: function changeFontOne(fontOne) {
                this.set('fontOne', fontOne);
            }
        }

    });
});
define('fontdrop/helpers/and', ['exports', 'ember-truth-helpers/helpers/and'], function (exports, _and) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_and.andHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_and.andHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/app-version', ['exports', 'fontdrop/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('fontdrop/helpers/array-contains', ['exports', 'ember-array-contains-helper/helpers/array-contains'], function (exports, _arrayContains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _arrayContains.default;
    }
  });
  Object.defineProperty(exports, 'arrayContains', {
    enumerable: true,
    get: function () {
      return _arrayContains.arrayContains;
    }
  });
});
define("fontdrop/helpers/check-url", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.checkUrl = checkUrl;
	function checkUrl(url /*, hash*/) {

		if (!/^(f|ht)tps?:\/\//i.test(url)) {
			url = "http://" + url;
		}
		return url;
	}

	exports.default = Ember.Helper.helper(checkUrl);
});
define("fontdrop/helpers/clean-spaces", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.cleanSpaces = cleanSpaces;

	// this helper removes spaces and special characters from a string

	function cleanSpaces(params /*, hash*/) {

		return params.join("").replace(/[^A-Z0-9]/ig, "");
	}

	exports.default = Ember.Helper.helper(cleanSpaces);
});
define('fontdrop/helpers/eq', ['exports', 'ember-truth-helpers/helpers/equal'], function (exports, _equal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_equal.equalHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_equal.equalHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/format-charcode', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatCharcode = formatCharcode;

  // this helper is used to transform charcode to a unicode letter (string)!

  function formatCharcode(charcode /*, hash*/) {

    return String.fromCharCode.apply(null, charcode);
  }

  exports.default = Ember.Helper.helper(formatCharcode);
});
define("fontdrop/helpers/format-unicode", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.formatUnicode = formatUnicode;
	function formatUnicode(unicodes /*, hash*/) {
		return unicodes.map(function (unicode) {
			unicode = parseInt(unicode);

			if (Number.isNaN(Number(unicode))) {
				return "none";
			} else {

				unicode = unicode.toString(16);

				if (unicode.length > 4) {
					return ("000000" + unicode.toUpperCase()).substr(-6);
				} else {
					return ("0000" + unicode.toUpperCase()).substr(-4);
				}
			}
		}).join(',');
	}

	exports.default = Ember.Helper.helper(formatUnicode);
});
define('fontdrop/helpers/gt', ['exports', 'ember-truth-helpers/helpers/gt'], function (exports, _gt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gt.gtHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gt.gtHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/gte', ['exports', 'ember-truth-helpers/helpers/gte'], function (exports, _gte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gte.gteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gte.gteHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/is-array', ['exports', 'ember-truth-helpers/helpers/is-array'], function (exports, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_isArray.isArrayHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_isArray.isArrayHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
define('fontdrop/helpers/lt', ['exports', 'ember-truth-helpers/helpers/lt'], function (exports, _lt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_lt.ltHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_lt.ltHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/lte', ['exports', 'ember-truth-helpers/helpers/lte'], function (exports, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_lte.lteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_lte.lteHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/not-eq', ['exports', 'ember-truth-helpers/helpers/not-equal'], function (exports, _notEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_notEqual.notEqualHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_notEqual.notEqualHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/not', ['exports', 'ember-truth-helpers/helpers/not'], function (exports, _not) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_not.notHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_not.notHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/or', ['exports', 'ember-truth-helpers/helpers/or'], function (exports, _or) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_or.orHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_or.orHelper);
  }

  exports.default = forExport;
});
define('fontdrop/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('fontdrop/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('fontdrop/helpers/waterfall-style', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waterfallStyle = waterfallStyle;
  function waterfallStyle(params /*, hash*/) {

    return Ember.String.htmlSafe('font-size:' + params + 'px');
  }

  exports.default = Ember.Helper.helper(waterfallStyle);
});
define('fontdrop/helpers/xor', ['exports', 'ember-truth-helpers/helpers/xor'], function (exports, _xor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_xor.xorHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_xor.xorHelper);
  }

  exports.default = forExport;
});
define('fontdrop/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'fontdrop/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('fontdrop/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('fontdrop/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('fontdrop/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('fontdrop/initializers/export-application-global', ['exports', 'fontdrop/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('fontdrop/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('fontdrop/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('fontdrop/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('fontdrop/initializers/truth-helpers', ['exports', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _registerHelper, _and, _or, _equal, _not, _isArray, _notEqual, _gt, _gte, _lt, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (Ember.Helper) {
      return;
    }

    (0, _registerHelper.registerHelper)('and', _and.andHelper);
    (0, _registerHelper.registerHelper)('or', _or.orHelper);
    (0, _registerHelper.registerHelper)('eq', _equal.equalHelper);
    (0, _registerHelper.registerHelper)('not', _not.notHelper);
    (0, _registerHelper.registerHelper)('is-array', _isArray.isArrayHelper);
    (0, _registerHelper.registerHelper)('not-eq', _notEqual.notEqualHelper);
    (0, _registerHelper.registerHelper)('gt', _gt.gtHelper);
    (0, _registerHelper.registerHelper)('gte', _gte.gteHelper);
    (0, _registerHelper.registerHelper)('lt', _lt.ltHelper);
    (0, _registerHelper.registerHelper)('lte', _lte.lteHelper);
  }

  exports.default = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define('fontdrop/initializers/viewport-config', ['exports', 'ember-in-viewport/initializers/viewport-config'], function (exports, _viewportConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _viewportConfig.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _viewportConfig.initialize;
    }
  });
});
define("fontdrop/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('fontdrop/mixins/loading-slider', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin,
      inject = Ember.inject,
      isPresent = Ember.isPresent;
  exports.default = Mixin.create({
    loadingSlider: inject.service(),

    actions: {
      loading: function loading() {
        var loadingSliderService = this.get('loadingSlider');
        loadingSliderService.startLoading();
        if (isPresent(this.router)) {
          this.router.one('didTransition', function () {
            loadingSliderService.endLoading();
          });
        }
        if (this.get('bubbleLoadingSlider')) {
          return true;
        }
      },
      finished: function finished() {
        this.get('loadingSlider').endLoading();
      }
    }
  });
});
define('fontdrop/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('fontdrop/router', ['exports', 'fontdrop/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('fontdrop/routes/application', { path: '/index.html' });
    this.route('compare');
    this.route('languages');
  });

  Router.reopen({
    location: 'hash'
  });

  exports.default = Router;
});
define('fontdrop/routes/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend();
});
define('fontdrop/routes/compare', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('fontdrop/routes/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('fontdrop/routes/languages', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('fontdrop/services/-in-viewport', ['exports', 'ember-in-viewport/services/-in-viewport'], function (exports, _inViewport) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _inViewport.default;
    }
  });
});
define('fontdrop/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('fontdrop/services/loading-slider', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service,
      Evented = Ember.Evented;
  exports.default = Service.extend(Evented, {
    startLoading: function startLoading() {
      this.trigger('startLoading');
    },
    endLoading: function endLoading() {
      this.trigger('endLoading');
    },
    changeAttrs: function changeAttrs(attrs) {
      this.trigger('changeAttrs', attrs);
    }
  });
});
define('fontdrop/services/scroller', ['exports', 'ember-scroll-to/services/scroller'], function (exports, _scroller) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _scroller.default;
    }
  });
});
define("fontdrop/statics/compareTexts", ["exports"], function (exports) {
               "use strict";

               Object.defineProperty(exports, "__esModule", {
                              value: true
               });
               exports.default = {
                              'compareTexts': [{ id: "1", name: "Latin", direction: "ltr", sample: "Traditionally, text is composed to create a readable, coherent, and visually satisfying typeface that works invisibly, without the awareness of the reader. Even distribution of typeset material, with a minimum of distractions and anomalies, is aimed at producing clarity and transparency. Choice of typeface(s) is the primary aspect of text typography—prose fiction, non-fiction, editorial, educational, religious, scientific, spiritual, and commercial writing all have differing characteristics and requirements of appropriate typefaces (and their fonts or styles). For historic material, established text typefaces frequently are chosen according to a scheme of historical genre acquired by a long process of accretion, with considerable overlap among historical periods. Contemporary books are more likely to be set with state-of-the-art “text roman” or “book romans” typefaces with serifs and design values echoing present-day design arts, which are closely based on traditional models such as those of Nicolas Jenson, Francesco Griffo (a punchcutter who created the model for Aldine typefaces), and Claude Garamond. [Source: Wikipedia, Typography]" }, { id: "2", name: "H&Co LC", direction: "ltr", sample: "H&Co Lowercase 1.0: Angel Adept Blind Bodice Clique Coast Dunce Docile Enact Eosin Furlong Focal Gnome Gondola Human Hoist Inlet Iodine Justin Jocose Knoll Koala Linden Loads Milliner Modal Number Nodule Onset Oddball Pneumo Poncho Quanta Qophs Rhone Roman Snout Sodium Tundra Tocsin Uncle Udder Vulcan Vocal Whale Woman Xmas Xenon Yunnan Young Zloty Zodiac. Angel angel adept for the nuance loads of the arena cocoa and quaalude. Blind blind bodice for the submit oboe of the club snob and abbot. Clique clique coast for the pouch loco of the franc assoc and accede. Dunce dunce docile for the loudness mastodon of the loud statehood and huddle. Enact enact eosin for the quench coed of the pique canoe and bleep. Furlong furlong focal for the genuflect profound of the motif aloof and oers. Gnome gnome gondola for the impugn logos of the unplug analog and smuggle. Human human hoist for the buddhist alcohol of the riyadh caliph and bathhouse. Inlet inlet iodine for the quince champion of the ennui scampi and shiite. Justin justin jocose for the djibouti sojourn of the oranj raj and hajjis. Knoll knoll koala for the banknote lookout of the dybbuk outlook and trekked. Linden linden loads for the ulna monolog of the consul menthol and shallot. Milliner milliner modal for the alumna solomon of the album custom and summon. Number number nodule for the unmade economic of the shotgun bison and tunnel. Onset onset oddball for the abandon podium of the antiquo tempo and moonlit. Pneumo pneumo poncho for the dauphin opossum of the holdup bishop and supplies. Quanta quanta qophs for the inquest sheqel of the cinq coq and suqqu. Rhone rhone roman for the burnt porous of the lemur clamor and carrot. Snout snout sodium for the ensnare bosom of the genus pathos and missing. Tundra tundra tocsin for the nutmeg isotope of the peasant ingot and ottoman. Uncle uncle udder for the dunes cloud of the hindu thou and continuum. Vulcan vulcan vocal for the alluvial ovoid of the yugoslav chekhov and revved. Whale whale woman for the meanwhile blowout of the forepaw meadow and glowworm. Xmas xmas xenon for the bauxite doxology of the tableaux equinox and exxon. Yunnan yunnan young for the dynamo coyote of the obloquy employ and sayyid. Zloty zloty zodiac for the gizmo ozone of the franz laissez and buzzing." }, { id: "3", name: "H&Co UC", direction: "ltr", sample: "H&Co Uppercase 1.0: ABIDE ACORN OF THE HABIT DACRON FOR THE BUDDHA GOUDA QUAALUDE. BENCH BOGUS OF THE SCRIBE ROBOT FOR THE APLOMB JACOB RIBBON. CENSUS CORAL OF THE SPICED JOCOSE FOR THE BASIC HAVOC SOCCER. DEMURE DOCILE OF THE TIDBIT LODGER FOR THE CUSPID PERIOD BIDDER. EBBING ECHOING OF THE BUSHED DECAL FOR THE APACHE ANODE NEEDS. FEEDER FOCUS OF THE LIFER BEDFORD FOR THE SERIF PROOF BUFFER. GENDER GOSPEL OF THE PIGEON DOGCART FOR THE SPRIG QUAHOG DIGGER. HERALD HONORS OF THE DIHEDRAL MADHOUSE FOR THE PENH RIYADH BATHHOUSE. IBSEN ICEMAN OF THE APHID NORDIC FOR THE SUSHI SAUDI SHIITE. JENNIES JOGGER OF THE TIJERA ADJOURN FOR THE ORANJ KOWBOJ HAJJIS. KEEPER KOSHER OF THE SHRIKE BOOKCASE FOR THE SHEIK LOGBOOK CHUKKAS. LENDER LOCKER OF THE CHILD GIGOLO FOR THE UNCOIL GAMBOL ENROLLED. MENACE MCCOY OF THE NIMBLE TOMCAT FOR THE DENIM RANDOM SUMMON. NEBULA NOSHED OF THE INBRED BRONCO FOR THE COUSIN CARBON KENNEL. OBSESS OCEAN OF THE PHOBIC DOCKSIDE FOR THE GAUCHO LIBIDO HOODED. PENNIES PODIUM OF THE SNIPER OPCODE FOR THE SCRIP BISHOP HOPPER. QUANTA QOPHS OF THE INQUEST OQOS FOR THE CINQ COQ SUQQU. REDUCE ROGUE OF THE GIRDLE ORCHID FOR THE MEMOIR SENSOR SORREL. SENIOR SCONCE OF THE DISBAR GODSON FOR THE HUBRIS AMENDS LESSEN. TENDON TORQUE OF THE UNITED SCOTCH FOR THE NOUGHT FORGOT BITTERS. UNDER UGLINESS OF THE RHUBARB SEDUCE FOR THE MANCHU HINDU CONTINUUM. VERSED VOUCH OF THE DIVER OVOID FOR THE TELAVIV KARPOV FLIVVER. WENCH WORKER OF THE UNWED SNOWCAP FOR THE ANDREW ESCROW GLOWWORM. XENON XOCHITL OF THE MIXED BOXCAR FOR THE SUFFIX ICEBOX EXXON. YEOMAN YONDER OF THE HYBRID ARROYO FOR THE DINGHY BRANDY SAYYID. ZEBRA ZOMBIE OF THE PRIZED OZONE FOR THE FRANZ ARROZ BUZZING." }, { id: "4", name: "Arabic", direction: "rtl", sample: "التيبوغرافية أي فن صياغة الحروف (بالفرنسية القديمة: typographie) هو فن وأسلوب ترتيب اللغة المكتوبة لجعلها مرئية وساهلة قراءة وجاذبة.  ترتيب الحوف يشمل كل من اختيار عائلة الخط وحجم وطول الخط والمسافة بين السطور وبين الحروف وحتى تعديل المسافة بين زوجين من الحروف والوصلات الأبجدية. وتصميم الخطوط فن وثيق الصلة، حتى يعتبر جزءا من فن صياغة الحروف. وفن صياغة الحروف قد يستعمل في الزخرفة، بدون علاقة ببلاغ المعلومات. يختصر في كونه وسيلة تبين مدى الحس الفني لدى المصمم. ويعتمد فيه على استخدام الحروف غالبا، ليخرج المصمم لوحه فنية معبرة تتكون من حروف وجمل مرتبطة بالشكل المرسوم. وإن كانت الحروف أصعبها نظرا لوجود النقط على الحروف. يعتمد لذلك على تكرار الحروف والجمل بشكل جمالي بسيط، واستخدام أحجام مختلفة من الحروف والكلمات." }, { id: "5", name: "Armenian", direction: "ltr", sample: "Երբ ձեռքս նոր գիրք է ընկնում՝ մի առարկա, որը պատրաստվել է տպարանում գրաշարի, յուրահատուկ այդ հերոսի ձեռքով, մի ինչ-որ այլ հերոսի հնարած մեքենայի օգնությամբ, ես զգում եմ, որ նոր, կենդանի, խոսող, հրաշալի մի բան է մտնում իմ կյանքի մեջ։ Դա նոր պատգամ է, որ մարդը գրել է իր մասին աշխարհի ամենաբարդ, ամենախորհրդավոր, ամենամեծ սիրո արժանի արարածի մասին, որի աշխատանքով ու երեւակայությամբ են ստեղծվել աշխարհում այն ամենը, ինչ մեծ է ու սքանչելի։" }, { id: "6", name: "Cyrilic", direction: "ltr", sample: "Но расцвет типографики как отдельной сферы деятельности начался в Европе, где она появилась в середине XV века. Её распространению способствовали лёгкость и относительно малое количество символов в латинском шрифте, в отличие от китайских иероглифов. Первым, кто серьёзно занялся европейским типографическим искусством, стал Иоганн Гутенберг (1397—1468 гг.), немецкий изобретатель и ювелир. Создав в 1440 году из свинцовых букв наборную форму, он подарил миру первый печатный станок. Отныне создавать книги стало гораздо проще, их стоимость уменьшилась, а количество — возросло." }, { id: "7", name: "Greek", direction: "ltr", sample: "Τυπογραφία είναι η τέχνη της αποτύπωσης γραπτού λόγου και εικόνων σε χαρτί, ύφασμα, μέταλλο ή άλλο υλικό με τη βοήθεια τεχνικών μέσων και συνήθως σε μαζική κλίμακα. Η τυπογραφία ξεκίνησε ουσιαστικά τον 15ο αι. με την εφεύρεση του επίπεδου πιεστηρίου από τον Γουτεμβέργιο. Μέχρι τα τέλη του 20ού αι., η παραδοσιακή τυπογραφία χρησιμοποιούσε κινητά στοιχεία σε διάφορα μεγέθη και οικογένειες (γραμματοσειρές) φτιαγμένες από μέταλλο και σπανιότερα από ξύλο. Τα στοιχεία αυτά έμπαιναν σε ειδικές θήκες, τους σελιδοθέτες, και κατόπιν στο πιεστήριο για την εκτύπωση." }, { id: "8", name: "Hebrew", direction: "rtl", sample: "טיפוגרפיה (Typography) היא האמנות והטכניקה של סידור ועיצוב טקסט. סידור אותיות כולל בחירת גופנים, גודל אות, גודל השוליים, אורך שורה, ריווח בין שורות, בין מילים, בין אותיות ובין צמדי אותיות. במלאכת הטיפוגרפיה עוסקים, בין היתר, מעצבים גרפיים, מעצבי אותיות, טיפוגרפים ופרסומאים." }, { id: "p", name: "Hindi", direction: "ltr", sample: "मुद्रण कला मुद्रण को सजाने, मुद्रण डिजाइन तथा मुद्रण ग्लिफ्स को संशोधित करने की कला एवं तकनीक है। मुद्रण ग्लिफ़ को विभिन्न उदाहरण तकनीकों का उपयोग करके बनाया और संशोधित किया जाता है। मुद्रण की सजावट में टाइपफेस का चुनाव, प्वायंट साईज, लाइन की लंबाई, लिडिंग (लाइन स्पेसिंग) अक्षर समूहों के बीच स्पेस (ट्रैकिंग) तथा अक्षर जोड़ों के बीच के स्पेस (केर्निंग) को व्यवस्थित करना शामिल हैं. टाइपोग्राफी का टाइपसेटर, कम्पोजिटर, टाइपोग्राफर, ग्राफिक डिजाइनर, कला निर्देशक, कॉमिक बुक कलाकार, भित्तिचित्र कलाकार तथा क्लैरिकल वर्करों द्वारा किया जाता है। डिजिटल युग के आने तक टाइपोग्राफी एक विशेष प्रकार का व्यवसाय था। डिजिटलीकरण ने टाइपोग्राफी को नई पीढ़ी के दृश्य डिजाइनरों और ले युजरों के लिए सुगम बना दिया." }, { id: "9", name: "Vietnames", direction: "ltr", sample: "Hệ chữ viết là là một phương pháp lưu trữ thông tin và chuyển giao tin nhắn (thể hiện suy nghĩ hoặc ý tưởng) được tổ chức (thông thường được chuẩn hóa) trong một ngôn ngữ bằng cách mã hóa và giải mã theo cách trực quan (hoặc có thể gián tiếp). Quá trình mã hóa và giải mã này được gọi là viết và đọc, bao gồm một tập hợp các dấu hiệu hoặc chữ tượng hình, cả hai được biết đến như là các ký tự. Các ký tự này bao gồm cả chữ và số, thường được ghi vào một vật lưu trữ như giấy hoặc thiết bị lưu trữ điện tử. Các phương pháp không bền cũng có thể được sử dụng, chẳng hạn như viết trên cát hoặc vẽ lên trời bằng khói máy bay." }]
               };
});
define("fontdrop/statics/languageData", ["exports"], function (exports) {
                "use strict";

                Object.defineProperty(exports, "__esModule", {
                                value: true
                });
                exports.default = {
                                'languageData': [{ script: "Arabic", name: "Arabic", wikipedia: "Arabic", langindex: [1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1648, 64488, 64489, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65241, 65242, 65243, 65244, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262, 65263, 65264, 65265, 65266, 65267, 65268] }, { script: "Arabic", name: "Central Kurdish", wikipedia: "Sorani", langindex: [1574, 1575, 1576, 1578, 1580, 1581, 1582, 1583, 1585, 1586, 1587, 1588, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1608, 1662, 1670, 1685, 1688, 1700, 1705, 1711, 1717, 1726, 1734, 1740, 1742, 1749, 64342, 64343, 64344, 64345, 64362, 64363, 64364, 64365, 64378, 64379, 64380, 64381, 64394, 64395, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64426, 64427, 64428, 64429, 64473, 64474, 64508, 64509, 64510, 64511, 65165, 65166, 65167, 65168, 65169, 65170, 65173, 65174, 65175, 65176, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65261, 65262] }, { script: "Arabic", name: "Mazanderani", wikipedia: "Mazanderani_language", langindex: [1569, 1570, 1571, 1572, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1607, 1608, 1611, 1612, 1613, 1617, 1620, 1662, 1670, 1688, 1705, 1711, 1740, 64342, 64343, 64344, 64345, 64378, 64379, 64380, 64381, 64394, 64395, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64508, 64509, 64510, 64511, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262] }, { script: "Arabic", name: "Northern Luri", wikipedia: "Luri_language", langindex: [1570, 1571, 1572, 1574, 1575, 1576, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1597, 1601, 1602, 1604, 1605, 1606, 1608, 1625, 1627, 1662, 1670, 1688, 1700, 1705, 1711, 1726, 1737, 1738, 1740, 1749, 64342, 64343, 64344, 64345, 64362, 64363, 64364, 64365, 64378, 64379, 64380, 64381, 64394, 64395, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64426, 64427, 64428, 64429, 64482, 64483, 64508, 64509, 64510, 64511, 65165, 65166, 65167, 65168, 65169, 65170, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65261, 65262] }, { script: "Arabic", name: "Pashto", wikipedia: "Pashto", langindex: [1569, 1570, 1571, 1572, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1607, 1608, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1620, 1648, 1660, 1662, 1665, 1669, 1670, 1673, 1683, 1686, 1688, 1690, 1705, 1707, 1711, 1724, 1740, 1741, 1744, 64342, 64343, 64344, 64345, 64378, 64379, 64380, 64381, 64394, 64395, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64484, 64485, 64486, 64487, 64508, 64509, 64510, 64511, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262, 65265, 65266, 65267, 65268] }, { script: "Arabic", name: "Persian", wikipedia: "Persian_language", langindex: [1569, 1570, 1571, 1572, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1607, 1608, 1611, 1612, 1613, 1617, 1620, 1662, 1670, 1688, 1705, 1711, 1740, 64342, 64343, 64344, 64345, 64378, 64379, 64380, 64381, 64394, 64395, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64508, 64509, 64510, 64511, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262] }, { script: "Arabic", name: "Punjabi", wikipedia: "Punjabi_language", langindex: [1569, 1570, 1572, 1574, 1575, 1576, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1607, 1608, 1615, 1657, 1662, 1670, 1672, 1681, 1688, 1705, 1711, 1722, 1726, 1729, 1740, 1746, 64342, 64343, 64344, 64345, 64358, 64359, 64360, 64361, 64378, 64379, 64380, 64381, 64392, 64393, 64394, 64395, 64396, 64397, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64414, 64415, 64422, 64423, 64424, 64425, 64426, 64427, 64428, 64429, 64430, 64431, 64508, 64509, 64510, 64511, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262] }, { script: "Arabic", name: "Urdu", wikipedia: "Urdu", langindex: [1569, 1570, 1571, 1572, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1607, 1608, 1657, 1662, 1670, 1672, 1681, 1688, 1705, 1711, 1722, 1726, 1729, 1730, 1740, 1746, 64342, 64343, 64344, 64345, 64358, 64359, 64360, 64361, 64378, 64379, 64380, 64381, 64392, 64393, 64394, 64395, 64396, 64397, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64414, 64415, 64422, 64423, 64424, 64425, 64426, 64427, 64428, 64429, 64430, 64431, 64508, 64509, 64510, 64511, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262] }, { script: "Arabic", name: "Uzbek (Arabic)", wikipedia: "Uzbek_language", langindex: [1569, 1570, 1571, 1572, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1601, 1602, 1604, 1605, 1606, 1607, 1608, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1620, 1648, 1662, 1670, 1688, 1705, 1711, 1735, 1737, 1740, 64342, 64343, 64344, 64345, 64378, 64379, 64380, 64381, 64394, 64395, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64471, 64472, 64482, 64483, 64508, 64509, 64510, 64511, 65152, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173, 65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188, 65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203, 65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218, 65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233, 65234, 65235, 65236, 65237, 65238, 65239, 65240, 65245, 65246, 65247, 65248, 65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262] }, { script: "Armenian", name: "Armenian", wikipedia: "Armenian_language", langindex: [1329, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1377, 1378, 1379, 1380, 1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1400, 1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415] }, { script: "Bengali", name: "Assamese", wikipedia: "Assamese_language", langindex: [2433, 2434, 2435, 2437, 2438, 2439, 2440, 2441, 2442, 2443, 2447, 2448, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458, 2459, 2460, 2461, 2462, 2463, 2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2474, 2475, 2476, 2477, 2478, 2479, 2482, 2486, 2487, 2488, 2489, 2492, 2494, 2495, 2496, 2497, 2498, 2499, 2503, 2504, 2507, 2508, 2509, 2544, 2545] }, { script: "Bengali", name: "Bengali", wikipedia: "Bengali_language", langindex: [2433, 2434, 2435, 2437, 2438, 2439, 2440, 2441, 2442, 2443, 2444, 2447, 2448, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458, 2459, 2460, 2461, 2462, 2463, 2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2474, 2475, 2476, 2477, 2478, 2479, 2480, 2482, 2486, 2487, 2488, 2489, 2492, 2493, 2494, 2495, 2496, 2497, 2498, 2499, 2500, 2503, 2504, 2507, 2508, 2509, 2510, 2519, 2528, 2529, 2530, 2531, 2554] }, { script: "Cherokee", name: "Cherokee", wikipedia: "Cherokee_language", langindex: [5024, 5025, 5026, 5027, 5028, 5029, 5030, 5031, 5032, 5033, 5034, 5035, 5036, 5037, 5038, 5039, 5040, 5041, 5042, 5043, 5044, 5045, 5046, 5047, 5048, 5049, 5050, 5051, 5052, 5053, 5054, 5055, 5056, 5057, 5058, 5059, 5060, 5061, 5062, 5063, 5064, 5065, 5066, 5067, 5068, 5069, 5070, 5071, 5072, 5073, 5074, 5075, 5076, 5077, 5078, 5079, 5080, 5081, 5082, 5083, 5084, 5085, 5086, 5087, 5088, 5089, 5090, 5091, 5092, 5093, 5094, 5095, 5096, 5097, 5098, 5099, 5100, 5101, 5102, 5103, 5104, 5105, 5106, 5107, 5108, 5112, 5113, 5114, 5115, 5116, 43888, 43889, 43890, 43891, 43892, 43893, 43894, 43895, 43896, 43897, 43898, 43899, 43900, 43901, 43902, 43903, 43904, 43905, 43906, 43907, 43908, 43909, 43910, 43911, 43912, 43913, 43914, 43915, 43916, 43917, 43918, 43919, 43920, 43921, 43922, 43923, 43924, 43925, 43926, 43927, 43928, 43929, 43930, 43931, 43932, 43933, 43934, 43935, 43936, 43937, 43938, 43939, 43940, 43941, 43942, 43943, 43944, 43945, 43946, 43947, 43948, 43949, 43950, 43951, 43952, 43953, 43954, 43955, 43956, 43957, 43958, 43959, 43960, 43961, 43962, 43963, 43964, 43965, 43966, 43967] }, { script: "Cyrillic", name: "Azerbaijani", wikipedia: "Azerbaijani_language", langindex: [1032, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1063, 1064, 1067, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1095, 1096, 1099, 1112, 1170, 1171, 1180, 1181, 1198, 1199, 1208, 1209, 1210, 1211, 1240, 1241, 1256, 1257] }, { script: "Cyrillic", name: "Belarusian", wikipedia: "Belarusian_language", langindex: [1025, 1030, 1038, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1099, 1100, 1101, 1102, 1103, 1105, 1110, 1118] }, { script: "Cyrillic", name: "Bosnian", wikipedia: "Bosnian_language", langindex: [1026, 1032, 1033, 1034, 1035, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1106, 1112, 1113, 1114, 1115, 1119] }, { script: "Cyrillic", name: "Bulgarian", wikipedia: "Bulgarian_language", langindex: [1026, 1032, 1033, 1034, 1035, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1068, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1100, 1102, 1103, 1106, 1112, 1113, 1114, 1115, 1119] }, { script: "Cyrillic", name: "Chechen", wikipedia: "Chechen_language", langindex: [1025, 1026, 1032, 1033, 1034, 1035, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1105, 1106, 1112, 1113, 1114, 1115, 1119] }, { script: "Cyrillic", name: "Church Slavic", wikipedia: "Church_Slavonic", langindex: [1026, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1070, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1102, 1106, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 1119, 1120, 1121, 1122, 1123, 1126, 1127, 1130, 1131, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1146, 1147, 1148, 1149, 1150, 1151, 1154, 1155, 1159, 11744, 11745, 11746, 11747, 11748, 11749, 11750, 11751, 11752, 11753, 11754, 11756, 11757, 11759, 11761, 11764, 11823, 42560, 42561, 42570, 42571, 42572, 42573, 42582, 42583, 42621, 42623] }, { script: "Cyrillic", name: "Macedonian", wikipedia: "Macedonian_language", langindex: [1027, 1029, 1032, 1033, 1034, 1036, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1107, 1109, 1112, 1113, 1114, 1116, 1119] }, { script: "Cyrillic", name: "Ossetic", wikipedia: "Ossetian_language", langindex: [1025, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1105, 1236, 1237] }, { script: "Cyrillic", name: "Russian", wikipedia: "Russian_language", langindex: [1025, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1105] }, { script: "Cyrillic", name: "Sakha", wikipedia: "Yakut_language", langindex: [1040, 1041, 1043, 1044, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1061, 1063, 1067, 1069, 1072, 1073, 1075, 1076, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1093, 1095, 1099, 1101, 1172, 1173, 1188, 1189, 1198, 1199, 1210, 1211, 1256, 1257] }, { script: "Cyrillic", name: "Serbian", wikipedia: "Serbian_language", langindex: [1026, 1032, 1033, 1034, 1035, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1106, 1112, 1113, 1114, 1115, 1119] }, { script: "Cyrillic", name: "Ukrainian", wikipedia: "Ukrainian_language", langindex: [700, 1028, 1030, 1031, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1068, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1100, 1102, 1103, 1108, 1110, 1111, 1168, 1169] }, { script: "Cyrillic", name: "Uzbek", wikipedia: "Uzbek_language", langindex: [1025, 1038, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1063, 1064, 1066, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1095, 1096, 1098, 1101, 1102, 1103, 1105, 1118, 1170, 1171, 1178, 1179, 1202, 1203] }, { script: "Devanagari", name: "Bodo", wikipedia: "Boro_language_(India)", langindex: [2305, 2306, 2309, 2310, 2311, 2312, 2313, 2314, 2317, 2319, 2320, 2321, 2323, 2324, 2325, 2326, 2327, 2328, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 2342, 2343, 2344, 2346, 2347, 2348, 2349, 2350, 2351, 2352, 2354, 2355, 2357, 2358, 2359, 2360, 2361, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2373, 2375, 2376, 2377, 2379, 2380, 2381] }, { script: "Devanagari", name: "Hindi", wikipedia: "Hindi", langindex: [2305, 2306, 2307, 2309, 2310, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2319, 2320, 2321, 2323, 2324, 2325, 2326, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 2342, 2343, 2344, 2346, 2347, 2348, 2349, 2350, 2351, 2352, 2354, 2355, 2357, 2358, 2359, 2360, 2361, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2375, 2376, 2377, 2379, 2380, 2381, 2384] }, { script: "Devanagari", name: "Konkani", wikipedia: "Konkani_language", langindex: [2305, 2306, 2307, 2309, 2310, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2319, 2320, 2321, 2323, 2324, 2325, 2326, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 2342, 2343, 2344, 2346, 2347, 2348, 2349, 2350, 2351, 2352, 2354, 2355, 2357, 2358, 2359, 2360, 2361, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2375, 2376, 2377, 2379, 2380, 2381, 2384, 2406, 2407, 2408, 2409, 2410, 2411, 2412, 2413, 2414, 2415] }, { script: "Devanagari", name: "Marathi", wikipedia: "Marathi_language", langindex: [2305, 2306, 2307, 2309, 2310, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2319, 2320, 2321, 2323, 2324, 2325, 2326, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 2342, 2343, 2344, 2346, 2347, 2348, 2349, 2350, 2351, 2352, 2354, 2355, 2357, 2358, 2359, 2360, 2361, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2375, 2376, 2377, 2379, 2380, 2381, 2384] }, { script: "Devanagari", name: "Nepali", wikipedia: "Nepali_language", langindex: [2305, 2306, 2307, 2309, 2310, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2319, 2320, 2321, 2323, 2324, 2325, 2326, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 2342, 2343, 2344, 2346, 2347, 2348, 2349, 2350, 2351, 2352, 2354, 2355, 2357, 2358, 2359, 2360, 2361, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2375, 2376, 2377, 2379, 2380, 2381, 2384] }, { script: "Georgian", name: "Georgian", wikipedia: "Georgian_language", langindex: [4304, 4305, 4306, 4307, 4308, 4309, 4310, 4311, 4312, 4313, 4314, 4315, 4316, 4317, 4318, 4319, 4320, 4321, 4322, 4323, 4324, 4325, 4326, 4327, 4328, 4329, 4330, 4331, 4332, 4333, 4334, 4335, 4336] }, { script: "Greek", name: "Greek", wikipedia: "Greek_language", langindex: [902, 904, 905, 906, 908, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974] }, { script: "Gujarati", name: "Gujarati", wikipedia: "Gujarati_language", langindex: [2433, 2434, 2435, 2437, 2438, 2439, 2440, 2441, 2442, 2443, 2444, 2447, 2448, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458, 2459, 2460, 2461, 2462, 2463, 2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2474, 2475, 2476, 2477, 2478, 2479, 2480, 2482, 2486, 2487, 2488, 2489, 2492, 2493, 2494, 2495, 2496, 2497, 2498, 2499, 2500, 2503, 2504, 2507, 2508, 2509, 2510, 2519, 2528, 2529, 2530, 2531, 25542689, 2690, 2691, 2693, 2694, 2695, 2696, 2697, 2698, 2699, 2701, 2703, 2704, 2705, 2707, 2708, 2709, 2710, 2711, 2712, 2713, 2714, 2715, 2716, 2717, 2718, 2719, 2720, 2721, 2722, 2723, 2724, 2725, 2726, 2727, 2728, 2730, 2731, 2732, 2733, 2734, 2735, 2736, 2738, 2739, 2741, 2742, 2743, 2744, 2745, 2748, 2749, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2759, 2760, 2761, 2763, 2764, 2765, 2768, 2784] }, { script: "Gurmukhi", name: "Punjabi (Gurmukhi)", wikipedia: "Punjabi_language", langindex: [2565, 2566, 2567, 2568, 2569, 2570, 2575, 2576, 2579, 2580, 2581, 2582, 2583, 2584, 2585, 2586, 2587, 2588, 2589, 2590, 2591, 2592, 2593, 2594, 2595, 2596, 2597, 2598, 2599, 2600, 2602, 2603, 2604, 2605, 2606, 2607, 2608, 2610, 2613, 2616, 2617, 2620, 2622, 2623, 2624, 2625, 2626, 2631, 2632, 2635, 2636, 2637, 2652, 2662, 2663, 2664, 2665, 2666, 2667, 2668, 2669, 2670, 2671, 2672, 2673, 2674, 2675, 2676] }, { script: "Hebrew", name: "Hebrew", wikipedia: "Hebrew_language", langindex: [1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514] }, { script: "Hebrew", name: "Yiddish", wikipedia: "Yiddish", langindex: [1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1509, 1510, 1511, 1512, 1513, 1514] }, { script: "Khmer", name: "Khmer", wikipedia: "Khmer_language", langindex: [6016, 6017, 6018, 6019, 6020, 6021, 6022, 6023, 6024, 6025, 6026, 6027, 6028, 6029, 6030, 6031, 6032, 6033, 6034, 6035, 6036, 6037, 6038, 6039, 6040, 6041, 6042, 6043, 6044, 6047, 6048, 6049, 6050, 6053, 6054, 6055, 6057, 6058, 6059, 6060, 6061, 6062, 6063, 6064, 6065, 6066, 6067, 6070, 6071, 6072, 6073, 6074, 6075, 6076, 6077, 6078, 6079, 6080, 6081, 6082, 6083, 6084, 6085, 6086, 6087, 6088, 6089, 6090, 6091, 6093, 6096, 6098] }, { script: "Kannada", name: "Kannada", wikipedia: "Kannada", langindex: [3202, 3203, 3205, 3206, 3207, 3208, 3209, 3210, 3211, 3212, 3214, 3215, 3216, 3218, 3219, 3220, 3221, 3222, 3223, 3224, 3225, 3226, 3227, 3228, 3229, 3230, 3231, 3232, 3233, 3234, 3235, 3236, 3237, 3238, 3239, 3240, 3242, 3243, 3244, 3245, 3246, 3247, 3248, 3249, 3250, 3251, 3253, 3254, 3255, 3256, 3257, 3260, 3261, 3262, 3263, 3264, 3265, 3266, 3267, 3268, 3270, 3271, 3272, 3274, 3275, 3276, 3277, 3285, 3286, 3296, 3297, 3302, 3303, 3304, 3305, 3306, 3307, 3308, 3309, 3310, 3311] }, { script: "Lao", name: "Lao", wikipedia: "Lao_language", langindex: [3713, 3714, 3716, 3719, 3720, 3722, 3725, 3732, 3733, 3734, 3735, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3745, 3746, 3747, 3749, 3751, 3754, 3755, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3771, 3772, 3773, 3776, 3777, 3778, 3779, 3780, 3782, 3784, 3785, 3786, 3787, 3788, 3789, 3804, 3805] }, { script: "Latin", name: "Afrikaans", wikipedia: "Afrikaans", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 194, 200, 201, 202, 203, 206, 207, 212, 214, 219, 225, 226, 232, 233, 234, 235, 238, 239, 244, 246, 251] }, { script: "Latin", name: "Aghem", wikipedia: "Aghem_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 115, 116, 117, 118, 119, 121, 122, 192, 194, 200, 202, 204, 206, 210, 212, 217, 219, 224, 226, 232, 234, 236, 238, 242, 244, 249, 251, 256, 257, 274, 275, 282, 283, 298, 299, 330, 331, 332, 333, 362, 363, 390, 400, 407, 461, 462, 463, 464, 465, 466, 467, 468, 580, 596, 603, 616, 649, 660] }, { script: "Latin", name: "Akan", wikipedia: "Akan_languages", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 390, 400, 596, 603] }, { script: "Latin", name: "Albanian", wikipedia: "Albanian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 120, 121, 122, 199, 203, 231, 235] }, { script: "Latin", name: "Asturian", wikipedia: "Asturian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 120, 121, 122, 193, 201, 205, 209, 211, 218, 220, 225, 233, 237, 241, 243, 250, 252, 7716, 7717, 7734, 7735] }, { script: "Latin", name: "Asu", wikipedia: "Asu_language_(Nigeria)", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Bafia", wikipedia: "Bafia_languages", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 193, 201, 205, 211, 218, 225, 233, 237, 243, 250, 330, 331, 390, 398, 400, 477, 596, 603] }, { script: "Latin", name: "Basaa", wikipedia: "Basaa_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 192, 193, 194, 200, 201, 202, 204, 205, 206, 210, 211, 212, 217, 218, 219, 224, 225, 226, 232, 233, 234, 236, 237, 238, 242, 243, 244, 249, 250, 251, 256, 257, 274, 275, 282, 283, 298, 299, 323, 324, 330, 331, 332, 333, 362, 363, 385, 390, 400, 461, 462, 463, 464, 465, 466, 467, 468, 504, 505, 595, 596, 603] }, { script: "Latin", name: "Basque", wikipedia: "Basque_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 199, 209, 231, 241] }, { script: "Latin", name: "Bemba", wikipedia: "Bemba_language", langindex: [65, 66, 67, 69, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 83, 84, 85, 87, 89, 97, 98, 99, 101, 102, 103, 105, 106, 107, 108, 109, 110, 111, 112, 115, 116, 117, 119, 121] }, { script: "Latin", name: "Bena", wikipedia: "Bena_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Breton", wikipedia: "Breton_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 120, 121, 122, 202, 209, 217, 234, 241, 249] }, { script: "Latin", name: "Catalan", wikipedia: "Catalan_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 183, 192, 199, 200, 201, 205, 207, 210, 211, 218, 220, 224, 231, 232, 233, 237, 239, 242, 243, 250, 252] }, { script: "Latin", name: "Chiga", wikipedia: "Kiga_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Colognian", wikipedia: "Colognian", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 197, 198, 203, 214, 220, 223, 228, 229, 230, 235, 246, 252, 278, 279, 338, 339, 366, 367] }, { script: "Latin", name: "Cornish", wikipedia: "Cornish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Croatian", wikipedia: "Croatian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 262, 263, 268, 269, 272, 273, 352, 353, 381, 382] }, { script: "Latin", name: "Czech", wikipedia: "Czech_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 201, 205, 211, 218, 221, 225, 233, 237, 243, 250, 253, 268, 269, 270, 271, 282, 283, 327, 328, 344, 345, 352, 353, 356, 357, 366, 367, 381, 382] }, { script: "Latin", name: "Danish", wikipedia: "Danish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 197, 198, 216, 229, 230, 248] }, { script: "Latin", name: "Duala", wikipedia: "Duala_language", langindex: [65, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 99, 100, 101, 102, 103, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 193, 201, 205, 211, 218, 225, 233, 237, 243, 250, 330, 331, 362, 363, 385, 390, 394, 400, 595, 596, 599, 603] }, { script: "Latin", name: "Dutch", wikipedia: "Dutch_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 196, 201, 203, 205, 207, 211, 214, 218, 220, 225, 228, 233, 235, 237, 239, 243, 246, 250, 252] }, { script: "Latin", name: "Embu", wikipedia: "Embu_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 296, 297, 360, 361] }, { script: "Latin", name: "English", wikipedia: "English_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Esperanto", wikipedia: "Esperanto", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 264, 265, 284, 285, 292, 293, 308, 309, 348, 349, 364, 365] }, { script: "Latin", name: "Estonian", wikipedia: "Estonian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 213, 214, 220, 228, 245, 246, 252, 352, 353, 381, 382] }, { script: "Latin", name: "Ewe", wikipedia: "Ewe_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 193, 195, 200, 201, 204, 205, 210, 211, 213, 217, 218, 224, 225, 227, 232, 233, 236, 237, 242, 243, 245, 249, 250, 296, 297, 330, 331, 360, 361, 390, 393, 400, 401, 402, 404, 434, 596, 598, 603, 611, 651, 7868, 7869] }, { script: "Latin", name: "Ewondo", wikipedia: "Ewondo_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 192, 193, 194, 200, 201, 202, 204, 205, 206, 210, 211, 212, 217, 218, 219, 224, 225, 226, 232, 233, 234, 236, 237, 238, 242, 243, 244, 249, 250, 251, 282, 283, 323, 324, 330, 331, 390, 399, 400, 461, 462, 463, 464, 465, 466, 467, 468, 504, 505, 596, 601, 603] }, { script: "Latin", name: "Faroese", wikipedia: "Faroese_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 89, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 121, 193, 198, 205, 208, 211, 216, 218, 221, 225, 230, 237, 240, 243, 248, 250, 253] }, { script: "Latin", name: "Filipino", wikipedia: "Filipino_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 209, 241] }, { script: "Latin", name: "Finnish", wikipedia: "Finnish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 197, 214, 228, 229, 246, 352, 353, 381, 382] }, { script: "Latin", name: "French", wikipedia: "French_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 194, 198, 199, 200, 201, 202, 203, 206, 207, 212, 217, 219, 220, 224, 226, 230, 231, 232, 233, 234, 235, 238, 239, 244, 249, 251, 252, 255, 338, 339, 376] }, { script: "Latin", name: "Friulian", wikipedia: "Friulian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 194, 199, 200, 202, 204, 206, 210, 212, 217, 219, 224, 226, 231, 232, 234, 236, 238, 242, 244, 249, 251] }, { script: "Latin", name: "Fulah", wikipedia: "Fula_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 209, 241, 330, 331, 385, 394, 435, 436, 595, 599] }, { script: "Latin", name: "Galician", wikipedia: "Galician_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 201, 205, 209, 211, 218, 220, 225, 233, 237, 241, 243, 250, 252] }, { script: "Latin", name: "Ganda", wikipedia: "Luganda", langindex: [65, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 330, 331] }, { script: "Latin", name: "German", wikipedia: "German_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 214, 220, 223, 228, 246, 252] }, { script: "Latin", name: "Gusii", wikipedia: "Gusii_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Hawaiian", wikipedia: "Hawaiian_language", langindex: [65, 69, 72, 73, 75, 76, 77, 78, 79, 80, 85, 87, 97, 101, 104, 105, 107, 108, 109, 110, 111, 112, 117, 119, 256, 257, 274, 275, 298, 299, 332, 333, 362, 363, 699] }, { script: "Latin", name: "Hungarian", wikipedia: "Hungarian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 193, 201, 205, 211, 214, 218, 220, 225, 233, 237, 243, 246, 250, 252, 336, 337, 368, 369] }, { script: "Latin", name: "Icelandic", wikipedia: "Icelandic_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 88, 89, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 120, 121, 193, 198, 201, 205, 208, 211, 214, 218, 221, 222, 225, 230, 233, 237, 240, 243, 246, 250, 253, 254] }, { script: "Latin", name: "Igbo", wikipedia: "Igbo_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 7748, 7749, 7864, 7865, 7882, 7883, 7884, 7885, 7908, 7909] }, { script: "Latin", name: "Inari Sami", wikipedia: "Inari_Sámi_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 121, 122, 193, 194, 196, 225, 226, 228, 268, 269, 272, 273, 330, 331, 352, 353, 381, 382] }, { script: "Latin", name: "Indonesian", wikipedia: "Indonesian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Irish", wikipedia: "Irish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 76, 77, 78, 79, 80, 82, 83, 84, 85, 97, 98, 99, 100, 101, 102, 103, 104, 105, 108, 109, 110, 111, 112, 114, 115, 116, 117, 193, 201, 205, 211, 218, 225, 233, 237, 243, 250] }, { script: "Latin", name: "Italian", wikipedia: "Italian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 200, 201, 204, 210, 211, 217, 224, 232, 233, 236, 242, 243, 249] }, { script: "Latin", name: "Jola-Fonyi", wikipedia: "Jola-Fonyi_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 193, 201, 205, 209, 211, 218, 225, 233, 237, 241, 243, 250, 330, 331] }, { script: "Latin", name: "Kabuverdianu", wikipedia: "Cape_Verdean_Creole", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 88, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 120, 121, 122, 209, 241] }, { script: "Latin", name: "Kabyle", wikipedia: "Kabyle_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 268, 269, 400, 404, 486, 487, 603, 611, 7692, 7693, 7716, 7717, 7770, 7771, 7778, 7779, 7788, 7789, 7826, 7827] }, { script: "Latin", name: "Kako", wikipedia: "Kako_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 192, 193, 194, 200, 201, 202, 204, 205, 206, 210, 211, 212, 217, 218, 219, 224, 225, 226, 232, 233, 234, 236, 237, 238, 242, 243, 244, 249, 250, 251, 330, 331, 385, 390, 394, 400, 458, 459, 460, 595, 596, 599, 603] }, { script: "Latin", name: "Kalaallisut", wikipedia: "Greenlandic_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 194, 195, 197, 198, 201, 202, 205, 206, 212, 216, 218, 219, 225, 226, 227, 229, 230, 233, 234, 237, 238, 244, 248, 250, 251, 296, 297, 312, 360, 361] }, { script: "Latin", name: "Kalenjin", wikipedia: "Kalenjin_languages", langindex: [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 99, 100, 101, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121] }, { script: "Latin", name: "Kamba", wikipedia: "Kamba_language_(disambiguation)", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 121, 122, 296, 297, 360, 361] }, { script: "Latin", name: "Kikuyu", wikipedia: "Kikuyu_language", langindex: [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 77, 78, 79, 82, 84, 85, 87, 89, 97, 98, 99, 100, 101, 103, 104, 105, 106, 107, 109, 110, 111, 114, 116, 117, 119, 121, 296, 297, 360, 361] }, { script: "Latin", name: "Kinyarwanda", wikipedia: "Kinyarwanda", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Koyraboro Senni", wikipedia: "Koyraboro_Senni", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 195, 213, 227, 245, 330, 331, 352, 353, 381, 382, 413, 626, 7868, 7869] }, { script: "Latin", name: "Koyra Chiini", wikipedia: "Koyra_Chiini_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 195, 213, 227, 245, 330, 331, 352, 353, 381, 382, 413, 626, 7868, 7869] }, { script: "Latin", name: "Kwasio", wikipedia: "Kwasio_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 193, 194, 196, 201, 202, 205, 206, 207, 211, 212, 214, 218, 219, 225, 226, 228, 233, 234, 237, 238, 239, 243, 244, 246, 250, 251, 256, 257, 274, 275, 282, 283, 298, 299, 323, 324, 330, 331, 332, 333, 340, 341, 362, 363, 385, 390, 398, 400, 461, 462, 463, 464, 465, 466, 467, 468, 477, 595, 596, 603] }, { script: "Latin", name: "Lakota", wikipedia: "Lakota_language", langindex: [65, 66, 69, 71, 72, 73, 75, 76, 77, 78, 79, 80, 83, 84, 85, 87, 89, 90, 97, 98, 101, 103, 104, 105, 107, 108, 109, 110, 111, 112, 115, 116, 117, 119, 121, 122, 193, 201, 205, 211, 218, 225, 233, 237, 243, 250, 268, 269, 330, 331, 352, 353, 381, 382, 486, 487, 542, 543, 700] }, { script: "Latin", name: "Langi", wikipedia: "Langi", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 201, 205, 211, 218, 225, 233, 237, 243, 250, 407, 580, 616, 649] }, { script: "Latin", name: "Latvian", wikipedia: "Latvian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 256, 257, 268, 269, 274, 275, 290, 291, 298, 299, 310, 311, 315, 316, 325, 326, 352, 353, 362, 363, 381, 382] }, { script: "Latin", name: "Lingala", wikipedia: "Lingala", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 193, 194, 201, 202, 205, 206, 211, 212, 218, 225, 226, 233, 234, 237, 238, 243, 244, 250, 282, 283, 390, 400, 461, 462, 463, 464, 465, 466, 596, 603] }, { script: "Latin", name: "Lithuanian", wikipedia: "Lithuanian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 121, 122, 260, 261, 268, 269, 278, 279, 280, 281, 302, 303, 352, 353, 362, 363, 370, 371, 381, 382] }, { script: "Latin", name: "Lower Sorbian", wikipedia: "Lower_Sorbian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 211, 243, 262, 263, 268, 269, 282, 283, 321, 322, 323, 324, 340, 341, 346, 347, 352, 353, 377, 378, 381, 382] }, { script: "Latin", name: "Luba-Katanga", wikipedia: "Luba-Katanga_language", langindex: [65, 66, 67, 68, 69, 70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 116, 117, 118, 119, 121, 122, 192, 193, 200, 201, 204, 205, 210, 211, 217, 218, 224, 225, 232, 233, 236, 237, 242, 243, 249, 250, 390, 400, 596, 603] }, { script: "Latin", name: "Luo", wikipedia: "Luo_languages", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121] }, { script: "Latin", name: "Luxembourgish", wikipedia: "Luxembourgish", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 201, 203, 228, 233, 235] }, { script: "Latin", name: "Luyia", wikipedia: "Luhya_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Machame", wikipedia: "West_Kilimanjaro_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Makhuwa-Meetto", wikipedia: "Makhuwa_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Makonde", wikipedia: "Makonde_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Malagasy", wikipedia: "Malagasy_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 86, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 118, 121, 122, 192, 194, 200, 201, 202, 203, 204, 206, 207, 209, 212, 224, 226, 232, 233, 234, 235, 236, 238, 239, 241, 244] }, { script: "Latin", name: "Maltese", wikipedia: "Maltese_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 122, 192, 200, 204, 210, 217, 224, 232, 236, 242, 249, 266, 267, 288, 289, 294, 295, 379, 380] }, { script: "Latin", name: "Manx", wikipedia: "Manx_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 199, 231] }, { script: "Latin", name: "Masai", wikipedia: "Maasai_language", langindex: [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 99, 100, 101, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 192, 193, 194, 200, 201, 202, 204, 205, 206, 210, 211, 212, 217, 218, 219, 224, 225, 226, 232, 233, 234, 236, 237, 238, 242, 243, 244, 249, 250, 251, 256, 257, 274, 275, 298, 299, 330, 331, 332, 333, 362, 363, 390, 400, 407, 580, 596, 603, 616, 649] }, { script: "Latin", name: "Meru", wikipedia: "Meru_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 296, 297, 360, 361] }, { script: "Latin", name: "Metaʼ", wikipedia: "Metaʼ_language", langindex: [65, 66, 68, 69, 70, 71, 73, 74, 75, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 90, 97, 98, 100, 101, 102, 103, 105, 106, 107, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 122, 192, 200, 204, 210, 217, 224, 232, 236, 242, 249, 330, 331, 390, 399, 596, 601, 700] }, { script: "Latin", name: "Morisyen", wikipedia: "Mauritian_Creole", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Mundang", wikipedia: "Mundang_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 195, 203, 213, 227, 235, 245, 296, 297, 330, 331, 385, 394, 398, 477, 595, 599, 7804, 7805] }, { script: "Latin", name: "Nama", wikipedia: "Khoekhoe_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 194, 206, 212, 219, 226, 238, 244, 251, 448, 449, 450, 451] }, { script: "Latin", name: "Ngiemboon", wikipedia: "Ngiemboon_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 115, 116, 117, 118, 119, 121, 122, 192, 193, 194, 200, 201, 202, 204, 205, 210, 211, 212, 217, 218, 219, 224, 225, 226, 232, 233, 234, 236, 237, 242, 243, 244, 249, 250, 251, 255, 282, 283, 323, 324, 330, 331, 376, 390, 400, 461, 462, 465, 466, 467, 468, 580, 596, 603, 649, 700, 7742, 7743, 7812, 7813] }, { script: "Latin", name: "Ngomba", wikipedia: "Ngomba_language", langindex: [65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 102, 103, 104, 105, 106, 107, 108, 109, 110, 112, 115, 116, 117, 118, 119, 121, 122, 193, 194, 205, 206, 218, 219, 225, 226, 237, 238, 250, 251, 323, 324, 330, 331, 390, 400, 461, 462, 463, 464, 467, 468, 504, 505, 580, 596, 603, 649, 7742, 7743, 7812, 7813, 42891, 42892] }, { script: "Latin", name: "Northern Sami", wikipedia: "Northern_Sámi", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 193, 225, 268, 269, 272, 273, 330, 331, 352, 353, 358, 359, 381, 382] }, { script: "Latin", name: "North Ndebele", wikipedia: "Northern_Ndebele_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Norwegian Bokmål", wikipedia: "Bokmål", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 197, 198, 201, 210, 211, 212, 216, 224, 229, 230, 233, 242, 243, 244, 248] }, { script: "Latin", name: "Norwegian Nynorsk", wikipedia: "Nynorsk", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 197, 198, 201, 210, 211, 212, 216, 224, 229, 230, 233, 242, 243, 244, 248] }, { script: "Latin", name: "Nuer", wikipedia: "Nuer_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 203, 207, 214, 228, 235, 239, 246, 330, 331, 390, 400, 404, 596, 603, 611] }, { script: "Latin", name: "Nyankole", wikipedia: "Nkore_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Oromo", wikipedia: "Oromo_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Polish", wikipedia: "Polish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 122, 211, 243, 260, 261, 262, 263, 280, 281, 321, 322, 323, 324, 346, 347, 377, 378, 379, 380] }, { script: "Latin", name: "Portuguese", wikipedia: "Portuguese_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 193, 194, 195, 199, 201, 202, 205, 210, 211, 212, 213, 218, 224, 225, 226, 227, 231, 233, 234, 237, 242, 243, 244, 245, 250] }, { script: "Latin", name: "Prussian", wikipedia: "Prussia", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 256, 257, 274, 275, 290, 291, 298, 299, 310, 311, 325, 326, 332, 333, 342, 343, 352, 353, 362, 363, 381, 382, 538, 539, 7696, 7697] }, { script: "Latin", name: "Quechua", wikipedia: "Quechuan_languages", langindex: [65, 72, 73, 75, 76, 77, 78, 80, 81, 83, 84, 85, 87, 89, 97, 104, 105, 107, 108, 109, 110, 112, 113, 115, 116, 117, 119, 121, 209, 241] }, { script: "Latin", name: "Romanian", wikipedia: "Romanian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 88, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 120, 122, 194, 206, 226, 238, 258, 259, 536, 537, 538, 539] }, { script: "Latin", name: "Romansh", wikipedia: "Romansh_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 200, 201, 204, 210, 217, 224, 232, 233, 236, 242, 249] }, { script: "Latin", name: "Rombo", wikipedia: "Rombo_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Rundi", wikipedia: "Kirundi", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Rwa", wikipedia: "West_Kilimanjaro_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Samburu", wikipedia: "Samburu_language", langindex: [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 97, 98, 99, 100, 101, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121] }, { script: "Latin", name: "Sango", wikipedia: "Sango_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 194, 196, 202, 203, 206, 207, 212, 214, 217, 219, 220, 226, 228, 234, 235, 238, 239, 244, 246, 249, 251, 252] }, { script: "Latin", name: "Sangu", wikipedia: "Sangu_language_(Tanzania)", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 87, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 115, 116, 117, 118, 119, 121] }, { script: "Latin", name: "Scottish Gaelic", wikipedia: "Scottish_Gaelic", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 76, 77, 78, 79, 80, 82, 83, 84, 85, 97, 98, 99, 100, 101, 102, 103, 104, 105, 108, 109, 110, 111, 112, 114, 115, 116, 117, 192, 200, 204, 210, 217, 224, 232, 236, 242, 249] }, { script: "Latin", name: "Sena", wikipedia: "Sena_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 193, 194, 195, 199, 201, 202, 205, 210, 211, 212, 213, 218, 224, 225, 226, 227, 231, 233, 234, 237, 242, 243, 244, 245, 250] }, { script: "Latin", name: "Serbian", wikipedia: "Serbian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 262, 263, 268, 269, 272, 273, 352, 353, 381, 382] }, { script: "Latin", name: "Shambala", wikipedia: "Shambala_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Shona", wikipedia: "Shona_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Slovak", wikipedia: "Slovak_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 196, 201, 205, 211, 212, 218, 221, 225, 228, 233, 237, 243, 244, 250, 253, 268, 269, 270, 271, 313, 314, 317, 318, 327, 328, 340, 341, 352, 353, 356, 357, 381, 382] }, { script: "Latin", name: "Slovenian", wikipedia: "Slovene_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 122, 268, 269, 352, 353, 381, 382] }, { script: "Latin", name: "Soga", wikipedia: "Soga_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Somali", wikipedia: "Somali_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Latin", name: "Spanish", wikipedia: "Spanish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 201, 205, 209, 211, 218, 220, 225, 233, 237, 241, 243, 250, 252] }, { script: "Latin", name: "Swahili", wikipedia: "Swahili_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Swedish", wikipedia: "Swedish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 196, 197, 201, 214, 224, 228, 229, 233, 246] }, { script: "Latin", name: "Swiss German", wikipedia: "Swiss_German", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 196, 214, 220, 228, 246, 252] }, { script: "Latin", name: "Tachelhit", wikipedia: "Shilha_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 113, 114, 115, 116, 117, 119, 120, 121, 122, 400, 404, 603, 611, 7692, 7693, 7716, 7717, 7770, 7771, 7778, 7779, 7788, 7789] }, { script: "Latin", name: "Taita", wikipedia: "Taita_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Tasawaq", wikipedia: "Tasawaq_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 195, 213, 227, 245, 330, 331, 352, 353, 381, 382, 413, 626, 7868, 7869] }, { script: "Latin", name: "Teso", wikipedia: "Teso_language", langindex: [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88, 89, 97, 98, 99, 100, 101, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 120, 121] }, { script: "Latin", name: "Tongan", wikipedia: "Tongan_language", langindex: [65, 69, 70, 72, 73, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 97, 101, 102, 104, 105, 107, 108, 109, 110, 111, 112, 115, 116, 117, 118, 193, 201, 205, 211, 218, 225, 233, 237, 243, 250, 256, 257, 274, 275, 298, 299, 332, 333, 362, 363, 699] }, { script: "Latin", name: "Turkish", wikipedia: "Turkish_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 121, 122, 199, 214, 220, 231, 246, 252, 286, 287, 304, 305, 350, 351] }, { script: "Latin", name: "Upper Sorbian", wikipedia: "Upper_Sorbian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 211, 243, 262, 263, 268, 269, 282, 283, 321, 322, 323, 324, 344, 345, 352, 353, 381, 382] }, { script: "Latin", name: "Uzbek (Latin)", wikipedia: "Uzbek_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 120, 121, 122] }, { script: "Latin", name: "Vai", wikipedia: "Vai_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 195, 201, 205, 211, 213, 218, 225, 227, 233, 237, 243, 245, 250, 296, 297, 330, 331, 360, 361, 385, 390, 394, 400, 595, 596, 599, 603, 7868, 7869] }, { script: "Latin", name: "Vietnamese", wikipedia: "Vietnamese_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 192, 193, 194, 195, 200, 201, 202, 204, 205, 210, 211, 212, 213, 217, 218, 221, 224, 225, 226, 227, 232, 233, 234, 236, 237, 242, 243, 244, 245, 249, 250, 253, 258, 259, 272, 273, 296, 297, 360, 361, 416, 417, 431, 432, 7840, 7841, 7842, 7843, 7844, 7845, 7846, 7847, 7848, 7849, 7850, 7851, 7852, 7853, 7854, 7855, 7856, 7857, 7858, 7859, 7860, 7861, 7862, 7863, 7864, 7865, 7866, 7867, 7868, 7869, 7870, 7871, 7872, 7873, 7874, 7875, 7876, 7877, 7878, 7879, 7880, 7881, 7882, 7883, 7884, 7885, 7886, 7887, 7888, 7889, 7890, 7891, 7892, 7893, 7894, 7895, 7896, 7897, 7898, 7899, 7900, 7901, 7902, 7903, 7904, 7905, 7906, 7907, 7908, 7909, 7910, 7911, 7912, 7913, 7914, 7915, 7916, 7917, 7918, 7919, 7920, 7921, 7922, 7923, 7924, 7925, 7926, 7927, 7928, 7929] }, { script: "Latin", name: "Volapük", wikipedia: "Volapük", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 120, 121, 122, 196, 214, 220, 228, 246, 252, 352, 353] }, { script: "Latin", name: "Vunjo", wikipedia: "Central_Kilimanjaro_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122] }, { script: "Latin", name: "Walser", wikipedia: "Walser_German", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 193, 195, 196, 201, 205, 211, 213, 214, 218, 220, 225, 227, 228, 233, 237, 243, 245, 246, 250, 252, 268, 269, 352, 353, 360, 361] }, { script: "Latin", name: "Welsh", wikipedia: "Welsh_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 192, 193, 194, 196, 200, 201, 202, 203, 204, 205, 206, 207, 210, 211, 212, 214, 217, 218, 219, 220, 221, 224, 225, 226, 228, 232, 233, 234, 235, 236, 237, 238, 239, 242, 243, 244, 246, 249, 250, 251, 252, 253, 255, 372, 373, 374, 375, 376, 7808, 7809, 7810, 7811, 7812, 7813, 7922, 7923] }, { script: "Latin", name: "Western Frisian", wikipedia: "West_Frisian_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 121, 122, 193, 196, 201, 203, 204, 207, 210, 214, 218, 220, 225, 228, 233, 235, 236, 239, 242, 246, 250, 252, 7922, 7923] }, { script: "Latin", name: "Yangben", wikipedia: "Central_Yambasa_language", langindex: [65, 66, 67, 68, 69, 70, 72, 73, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 87, 89, 97, 98, 99, 100, 101, 102, 104, 105, 107, 108, 109, 110, 111, 112, 115, 116, 117, 118, 119, 121, 192, 193, 194, 200, 201, 204, 205, 206, 210, 211, 212, 217, 218, 219, 224, 225, 226, 232, 233, 236, 237, 238, 242, 243, 244, 249, 250, 251, 256, 257, 298, 299, 330, 331, 332, 333, 362, 363, 390, 400, 461, 462, 465, 466, 467, 468, 596, 603] }, { script: "Latin", name: "Yoruba", wikipedia: "Yoruba_language", langindex: [65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 87, 89, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 119, 121, 192, 193, 200, 201, 204, 205, 210, 211, 217, 218, 224, 225, 232, 233, 236, 237, 242, 243, 249, 250, 7778, 7779, 7864, 7865, 7884, 7885] }, { script: "Latin", name: "Zarma", wikipedia: "Zarma_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 195, 213, 227, 245, 330, 331, 352, 353, 381, 382, 413, 626, 7868, 7869] }, { script: "Latin", name: "Zulu", wikipedia: "Zulu_language", langindex: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122] }, { script: "Malayalam", name: "Malayalam", wikipedia: "Malayalam", langindex: [3330, 3331, 3333, 3334, 3335, 3336, 3337, 3338, 3339, 3340, 3342, 3343, 3344, 3346, 3347, 3348, 3349, 3350, 3351, 3352, 3353, 3354, 3355, 3356, 3357, 3358, 3359, 3360, 3361, 3362, 3363, 3364, 3365, 3366, 3367, 3368, 3370, 3371, 3372, 3373, 3374, 3375, 3376, 3377, 3378, 3379, 3380, 3381, 3382, 3383, 3384, 3385, 3390, 3391, 3392, 3393, 3394, 3395, 3398, 3399, 3400, 3402, 3403, 3404, 3405, 3415, 3424, 3425, 3450, 3451, 3452, 3453, 3454, 3455] }, { script: "Myanmar", name: "Burmese", wikipedia: "Burmese_language", langindex: [4096, 4097, 4098, 4099, 4100, 4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108, 4109, 4110, 4111, 4112, 4113, 4114, 4115, 4116, 4117, 4118, 4119, 4120, 4121, 4122, 4123, 4124, 4125, 4126, 4127, 4128, 4129, 4131, 4132, 4133, 4134, 4135, 4137, 4138, 4139, 4140, 4141, 4142, 4143, 4144, 4145, 4146, 4150, 4151, 4152, 4153, 4154, 4155, 4156, 4157, 4158, 4159] }, { script: "Oriya", name: "Oriya", wikipedia: "Odia_language", langindex: [2817, 2818, 2819, 2821, 2822, 2823, 2824, 2825, 2826, 2827, 2831, 2832, 2835, 2836, 2837, 2838, 2839, 2840, 2841, 2842, 2843, 2844, 2845, 2846, 2847, 2848, 2849, 2850, 2851, 2852, 2853, 2854, 2855, 2856, 2858, 2859, 2860, 2861, 2862, 2863, 2864, 2866, 2867, 2869, 2870, 2871, 2872, 2873, 2876, 2878, 2879, 2880, 2881, 2882, 2883, 2887, 2888, 2891, 2892, 2893, 2911, 2929] }, { script: "Sinhala", name: "Sinhala", wikipedia: "Sinhala_language", langindex: [3458, 3459, 3461, 3462, 3463, 3464, 3465, 3466, 3467, 3468, 3469, 3473, 3474, 3475, 3476, 3477, 3478, 3482, 3483, 3484, 3485, 3486, 3487, 3488, 3489, 3490, 3491, 3492, 3493, 3495, 3496, 3497, 3498, 3499, 3500, 3501, 3502, 3503, 3504, 3505, 3507, 3508, 3509, 3510, 3511, 3512, 3513, 3514, 3515, 3517, 3520, 3521, 3522, 3523, 3524, 3525, 3526, 3530, 3535, 3536, 3537, 3538, 3539, 3540, 3542, 3544, 3545, 3546, 3547, 3548, 3549, 3550, 3551, 3570] }, { script: "Tamil", name: "Tamil", wikipedia: "Tamil_language", langindex: [2947, 2949, 2950, 2951, 2952, 2953, 2954, 2958, 2959, 2960, 2962, 2963, 2964, 2965, 2969, 2970, 2972, 2974, 2975, 2979, 2980, 2984, 2985, 2986, 2990, 2991, 2992, 2993, 2994, 2995, 2996, 2997, 2999, 3000, 3001, 3006, 3007, 3008, 3009, 3010, 3014, 3015, 3016, 3018, 3019, 3020, 3021] }, { script: "Telugu", name: "Telugu", wikipedia: "Telugu_language", langindex: [3073, 3074, 3075, 3077, 3078, 3079, 3080, 3081, 3082, 3083, 3084, 3086, 3087, 3088, 3090, 3091, 3092, 3093, 3094, 3095, 3096, 3097, 3098, 3099, 3100, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3110, 3111, 3112, 3114, 3115, 3116, 3117, 3118, 3119, 3120, 3121, 3122, 3123, 3125, 3126, 3127, 3128, 3129, 3134, 3135, 3136, 3137, 3138, 3139, 3140, 3142, 3143, 3144, 3146, 3147, 3148, 3149, 3157, 3158, 3168, 3169] }, { script: "Tifinagh", name: "Standard Moroccan Tamazight", wikipedia: "Berber_languages", langindex: [11568, 11569, 11571, 11575, 11577, 11579, 11580, 11581, 11584, 11587, 11588, 11589, 11591, 11593, 11594, 11597, 11598, 11599, 11603, 11604, 11605, 11606, 11609, 11610, 11611, 11612, 11615, 11617, 11618, 11619, 11621] }, { script: "Thai", name: "Thai", wikipedia: "Thai_language", langindex: [3585, 3586, 3587, 3588, 3589, 3590, 3591, 3592, 3593, 3594, 3595, 3596, 3597, 3598, 3599, 3600, 3601, 3602, 3603, 3604, 3605, 3606, 3607, 3608, 3609, 3610, 3611, 3612, 3613, 3614, 3615, 3616, 3617, 3618, 3619, 3620, 3621, 3622, 3623, 3624, 3625, 3626, 3627, 3628, 3629, 3630, 3631, 3632, 3633, 3634, 3635, 3636, 3637, 3638, 3639, 3640, 3641, 3642, 3648, 3649, 3650, 3651, 3652, 3653, 3654, 3655, 3656, 3657, 3658, 3659, 3660, 3661, 3662] }, { script: "Tibetan", name: "Dzongkha", wikipedia: "Dzongkha", langindex: [3904, 3905, 3906, 3908, 3909, 3910, 3911, 3913, 3919, 3920, 3921, 3923, 3924, 3925, 3926, 3928, 3929, 3930, 3931, 3933, 3934, 3935, 3936, 3937, 3938, 3939, 3940, 3942, 3943, 3944, 3954, 3956, 3962, 3964, 3984, 3985, 3986, 3988, 3991, 3993, 3999, 4000, 4001, 4003, 4004, 4005, 4006, 4008, 4009, 4010, 4011, 4013, 4017, 4018, 4019, 4021, 4022, 4023] }, { script: "Tibetan", name: "Tibetan", wikipedia: "Tibetan", langindex: [3904, 3905, 3906, 3908, 3909, 3910, 3911, 3913, 3914, 3915, 3916, 3918, 3919, 3920, 3921, 3923, 3924, 3925, 3926, 3928, 3929, 3930, 3931, 3933, 3934, 3935, 3936, 3937, 3938, 3939, 3940, 3941, 3942, 3943, 3944, 3946, 3954, 3956, 3959, 3961, 3962, 3963, 3964, 3965, 3966, 3967, 3968, 3972, 3984, 3985, 3986, 3988, 3989, 3990, 3991, 3993, 3994, 3995, 3996, 3998, 3999, 4000, 4001, 4003, 4004, 4005, 4006, 4008, 4009, 4010, 4011, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 4020, 4021, 4022, 4023, 4024, 4026, 4027, 4028] }] };
});
define("fontdrop/statics/otFeatures", ["exports"], function (exports) {
				"use strict";

				Object.defineProperty(exports, "__esModule", {
								value: true
				});
				exports.default = {
								'otFeatures': [{ tag: "locl", name: "Localized Forms", desc: "These subsitutes work in combination with language settings of the browser. So the effect might not be visible.", fixed: 1 }, { tag: "rvrn", name: "Required Variation Alternates", desc: "This feature is used in fonts that support OpenType Font Variations in order to select alternate glyphs for particular variation instances.", fixed: 1 }, { tag: "hngl", name: "Hangul", desc: "Korean only", fixed: 1 }, { tag: "hojo", name: "Hojo Kanji Forms (JIS X 0212-1990 Kanji Forms)", desc: "Japanese only", fixed: 1 }, { tag: "jp04", name: "JIS2004 Forms", desc: "Japanese only", fixed: 1 }, { tag: "jp78", name: "JIS78 Forms", desc: "Japanese only", fixed: 1 }, { tag: "jp83", name: "JIS83 Forms", desc: "Japanese only", fixed: 1 }, { tag: "jp90", name: "JIS90 Forms", desc: "Japanese only", fixed: 1 }, { tag: "nlck", name: "NLC Kanji Forms", desc: "Japanese only", fixed: 1 }, { tag: "smpl", name: "Simplified Forms", fixed: 1 }, { tag: "tnam", name: "Traditional Name Forms", desc: "Japanese only", fixed: 1 }, { tag: "trad", name: "Traditional Forms", fixed: 1 }, { tag: "ltrm", name: "Left-to-right mirrored forms", fixed: 1 }, { tag: "ltra", name: "Left-to-right alternates", fixed: 1 }, { tag: "rtlm", name: "Right-to-left mirrored forms", fixed: 1 }, { tag: "rtla", name: "Right-to-left alternates", fixed: 1 }, { tag: "ccmp", name: "Glyph Composition / Decomposition", fixed: 1 }, { tag: "stch", name: "Stretching Glyph Decomposition", fixed: 1 }, { tag: "nukt", name: "Nukta Forms", desc: "Indic only", fixed: 1 }, { tag: "akhn", name: "Akhands", desc: "Indic only", fixed: 1 }, { tag: "rphf", name: "Reph Forms", desc: "South and Southeast Asian scripts; triggers reordering", fixed: 1 }, { tag: "pref", name: "Pre-Base forms,", desc: "South and Southeast Asian scripts; triggers reordering", fixed: 1 }, { tag: "rkrf", name: "Rakar Forms", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "abvf", name: "Above-base Forms", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "blwf", name: "Below-base Forms", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "half", name: "Half Forms", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "pstf", name: "Post-base Forms", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "vatu", name: "Vattu Variants", desc: "Used, inconsistently, instead of <rkrf> for some Indic scripts", fixed: 1 }, { tag: "cfar", name: "Conjunct Form After Ro", desc: "Currently Khmer only", fixed: 1 }, { tag: "cjct", name: "Conjunct Forms", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "med2", name: "Medial Forms 2", fixed: 1 }, { tag: "fin2", name: "Terminal Forms 2", fixed: 1 }, { tag: "fin3", name: "Terminal Forms 3", fixed: 1 }, { tag: "ljmo", name: "Leading Jamo Forms", desc: "Korean only", fixed: 1 }, { tag: "vjmo", name: "Vowel Jamo Forms", desc: "Korean only", fixed: 1 }, { tag: "tjmo", name: "Trailing Jamo Forms", desc: "Korean only", fixed: 1 }, { tag: "abvs", name: "Above-base Substitutions", fixed: 1 }, { tag: "blws", name: "Below-base Substitutions", fixed: 1 }, { tag: "calt", name: "Contextual Alternates", default: 1 }, { tag: "clig", name: "Contextual Ligatures", default: 1 }, { tag: "fina", name: "Terminal Forms", desc: 'May be "Orthographic unit shaping" for some writing systems; see discussion of topographical features', fixed: 1 }, { tag: "haln", name: "Halant Forms", fixed: 1 }, { tag: "init", name: "Initial Forms", desc: 'May be "Orthographic unit shaping" for some writing systems; see discussion of topographical features', fixed: 1 }, { tag: "isol", name: "Isolated Forms", desc: 'May be "Orthographic unit shaping" for some writing systems; see discussion of topographical features', fixed: 1 }, { tag: "jalt", name: "Justification Alternates", desc: 'Could be considered "Discretionary typographic presentation" if not applied by standard justification algorithms', default: 1 }, { tag: "liga", name: "Standard Ligatures", default: 1 }, { tag: "medi", name: "Medial Forms", desc: 'May be "Orthographic unit shaping" for some writing systems; see discussion of topographical features', fixed: 1 }, { tag: "mset", name: "Mark Positioning via Substitution", desc: "Legacy feature, superceded by <mark>", fixed: 1 }, { tag: "pres", name: "Pre-base Substitutions", fixed: 1 }, { tag: "psts", name: "Post-base Substitutions", fixed: 1 }, { tag: "rand", name: "Randomize", default: 1 }, { tag: "rclt", name: "Required Contextual Forms", fixed: 1 }, { tag: "rlig", name: "Required Ligatures", fixed: 1 }, { tag: "vert", name: "Vertical Writing", desc: "Applied based on text layout; use this or <vrt2>, not both; UTR50 implementation", fixed: 1 }, { tag: "vrt2", name: "Vertical Alternates and Rotation", desc: "Applied based on text layout; use this or <vert>, not both", fixed: 1 }, { tag: "afrc", name: "Alternative Fractions" }, { tag: "c2pc", name: "Petite Capitals From Capitals" }, { tag: "c2sc", name: "Small Capitals From Capitals" }, { tag: "case", name: "Case-Sensitive Forms", desc: 'Could be "Standard typographic presentation" if applied heuristically' }, { tag: "cpct", name: "Centered CJK Punctuation Mostly CJKV fonts" }, { tag: "cpsp", name: "Capital Spacing" }, { tag: "cswh", name: "Contextual Swash" }, { tag: "cv01", name: "Character Variant 01" }, { tag: "cv02", name: "Character Variant 02" }, { tag: "cv03", name: "Character Variant 03" }, { tag: "cv04", name: "Character Variant 04" }, { tag: "cv05", name: "Character Variant 05" }, { tag: "cv06", name: "Character Variant 06" }, { tag: "cv07", name: "Character Variant 07" }, { tag: "cv08", name: "Character Variant 08" }, { tag: "cv09", name: "Character Variant 09" }, { tag: "cv10", name: "Character Variant 10" }, { tag: "cv11", name: "Character Variant 11" }, { tag: "cv12", name: "Character Variant 12" }, { tag: "cv13", name: "Character Variant 13" }, { tag: "cv14", name: "Character Variant 14" }, { tag: "cv15", name: "Character Variant 15" }, { tag: "cv16", name: "Character Variant 16" }, { tag: "cv17", name: "Character Variant 17" }, { tag: "cv18", name: "Character Variant 18" }, { tag: "cv19", name: "Character Variant 19" }, { tag: "cv20", name: "Character Variant 20" }, { tag: "cv21", name: "Character Variant 21" }, { tag: "cv22", name: "Character Variant 22" }, { tag: "cv23", name: "Character Variant 23" }, { tag: "cv24", name: "Character Variant 24" }, { tag: "cv25", name: "Character Variant 25" }, { tag: "cv26", name: "Character Variant 26" }, { tag: "cv27", name: "Character Variant 27" }, { tag: "cv28", name: "Character Variant 28" }, { tag: "cv29", name: "Character Variant 29" }, { tag: "cv30", name: "Character Variant 30" }, { tag: "cv31", name: "Character Variant 31" }, { tag: "cv32", name: "Character Variant 32" }, { tag: "cv33", name: "Character Variant 33" }, { tag: "cv34", name: "Character Variant 34" }, { tag: "cv35", name: "Character Variant 35" }, { tag: "cv36", name: "Character Variant 36" }, { tag: "cv37", name: "Character Variant 37" }, { tag: "cv38", name: "Character Variant 38" }, { tag: "cv39", name: "Character Variant 39" }, { tag: "cv40", name: "Character Variant 40" }, { tag: "cv41", name: "Character Variant 41" }, { tag: "cv42", name: "Character Variant 42" }, { tag: "cv43", name: "Character Variant 43" }, { tag: "cv44", name: "Character Variant 44" }, { tag: "cv45", name: "Character Variant 45" }, { tag: "cv46", name: "Character Variant 46" }, { tag: "cv47", name: "Character Variant 47" }, { tag: "cv48", name: "Character Variant 48" }, { tag: "cv49", name: "Character Variant 49" }, { tag: "cv50", name: "Character Variant 50" }, { tag: "cv51", name: "Character Variant 51" }, { tag: "cv52", name: "Character Variant 52" }, { tag: "cv53", name: "Character Variant 53" }, { tag: "cv54", name: "Character Variant 54" }, { tag: "cv55", name: "Character Variant 55" }, { tag: "cv56", name: "Character Variant 56" }, { tag: "cv57", name: "Character Variant 57" }, { tag: "cv58", name: "Character Variant 58" }, { tag: "cv59", name: "Character Variant 59" }, { tag: "cv60", name: "Character Variant 60" }, { tag: "cv61", name: "Character Variant 61" }, { tag: "cv62", name: "Character Variant 62" }, { tag: "cv63", name: "Character Variant 63" }, { tag: "cv64", name: "Character Variant 64" }, { tag: "cv65", name: "Character Variant 65" }, { tag: "cv66", name: "Character Variant 66" }, { tag: "cv67", name: "Character Variant 67" }, { tag: "cv68", name: "Character Variant 68" }, { tag: "cv69", name: "Character Variant 69" }, { tag: "cv70", name: "Character Variant 70" }, { tag: "cv71", name: "Character Variant 71" }, { tag: "cv72", name: "Character Variant 72" }, { tag: "cv73", name: "Character Variant 73" }, { tag: "cv74", name: "Character Variant 74" }, { tag: "cv75", name: "Character Variant 75" }, { tag: "cv76", name: "Character Variant 76" }, { tag: "cv77", name: "Character Variant 77" }, { tag: "cv78", name: "Character Variant 78" }, { tag: "cv79", name: "Character Variant 79" }, { tag: "cv80", name: "Character Variant 80" }, { tag: "cv81", name: "Character Variant 81" }, { tag: "cv82", name: "Character Variant 82" }, { tag: "cv83", name: "Character Variant 83" }, { tag: "cv84", name: "Character Variant 84" }, { tag: "cv85", name: "Character Variant 85" }, { tag: "cv86", name: "Character Variant 86" }, { tag: "cv87", name: "Character Variant 87" }, { tag: "cv88", name: "Character Variant 88" }, { tag: "cv89", name: "Character Variant 89" }, { tag: "cv90", name: "Character Variant 90" }, { tag: "cv91", name: "Character Variant 91" }, { tag: "cv92", name: "Character Variant 92" }, { tag: "cv93", name: "Character Variant 93" }, { tag: "cv94", name: "Character Variant 94" }, { tag: "cv95", name: "Character Variant 95" }, { tag: "cv96", name: "Character Variant 96" }, { tag: "cv97", name: "Character Variant 97" }, { tag: "cv98", name: "Character Variant 98" }, { tag: "cv99", name: "Character Variant 99" }, { tag: "dlig", name: "Discretionary Ligatures" }, { tag: "dnom", name: "Denominators" }, { tag: "expt", name: "Expert Forms Currently Japanese only" }, { tag: "falt", name: "Final Glyph on Line Alternates", desc: 'Might be considered "Standard typographic presentation" in some implementations' }, { tag: "frac", name: "Fractions", desc: "Creating fraction can be complex, the results you see might not make any sense ..." }, { tag: "fwid", name: "Full Widths Mostly CJKV fonts" }, { tag: "halt", name: "Alternate Half Widths See also <vhal> positioning" }, { tag: "hist", name: "Historical Forms" }, { tag: "hkna", name: "Horizontal Kana Alternates", desc: "Currently Japanese kana only; could be applied automatically based on text layout;  cf. <vkna> vertical equivalent" }, { tag: "hlig", name: "Historical Ligatures" }, { tag: "hwid", name: "Half Widths" }, { tag: "ital", name: "Italics" }, { tag: "lnum", name: "Lining Figures" }, { tag: "mgrk", name: "Mathematical Greek" }, { tag: "nalt", name: "Alternate Annotation Forms" }, { tag: "numr", name: "Numerators" }, { tag: "onum", name: "Oldstyle Figures" }, { tag: "ordn", name: "Ordinals" }, { tag: "ornm", name: "Ornaments" }, { tag: "palt", name: "Proportional Alternate Widths" }, { tag: "pcap", name: "Petite Capitals" }, { tag: "pkna", name: "Proportional Kana", desc: "Japanese kana only" }, { tag: "pnum", name: "Proportional Figures" }, { tag: "pwid", name: "Proportional Widths", desc: "Mostly CJKV fonts" }, { tag: "qwid", name: "Quarter Widths", desc: "Mostly CJKV fonts" }, { tag: "ruby", name: "Ruby Notation Forms" }, { tag: "salt", name: "Stylistic Alternates" }, { tag: "sinf", name: "Scientific Inferiors" }, { tag: "smcp", name: "Small Capitals" }, { tag: "ss01", name: "Stylistic Set 01" }, { tag: "ss02", name: "Stylistic Set 02" }, { tag: "ss03", name: "Stylistic Set 03" }, { tag: "ss04", name: "Stylistic Set 04" }, { tag: "ss05", name: "Stylistic Set 05" }, { tag: "ss06", name: "Stylistic Set 06" }, { tag: "ss07", name: "Stylistic Set 07" }, { tag: "ss08", name: "Stylistic Set 08" }, { tag: "ss09", name: "Stylistic Set 09" }, { tag: "ss10", name: "Stylistic Set 10" }, { tag: "ss11", name: "Stylistic Set 11" }, { tag: "ss12", name: "Stylistic Set 12" }, { tag: "ss13", name: "Stylistic Set 13" }, { tag: "ss14", name: "Stylistic Set 14" }, { tag: "ss15", name: "Stylistic Set 15" }, { tag: "ss16", name: "Stylistic Set 16" }, { tag: "ss17", name: "Stylistic Set 17" }, { tag: "ss18", name: "Stylistic Set 18" }, { tag: "ss19", name: "Stylistic Set 19" }, { tag: "ss20", name: "Stylistic Set 20" }, { tag: "subs", name: "Subscript" }, { tag: "sups", name: "Superscript" }, { tag: "swsh", name: "Swash" }, { tag: "titl", name: "Titling" }, { tag: "tnum", name: "Tabular Figures" }, { tag: "twid", name: "Third Widths", desc: "Mostly CJKV fonts" }, { tag: "unic", name: "Unicase" }, { tag: "vkna", name: "Vertical Kana Alternates", desc: "Currently Japanese kana only; could be applied automatically based on text layout; cf. <hkna> horizontal equivalent" }, { tag: "zero", name: "Slashed Zero" }, { tag: "opbd", name: "Optical Bounds", desc: "Applied as part of optical margin alignment; probably redundant, see <lfbd> & <rtbd>" }, { tag: "lfbd", name: "Left Bounds", desc: "Applied as part of optical margin alignment" }, { tag: "rtbd", name: "Right Bounds", desc: "Applied as part of optical margin alignment" }, { tag: "valt", name: "Alternate Vertical Metrics", desc: "Applied based on text layout", fixed: 1 }, { tag: "vpal", name: "Proportional Alternate Vertical Metrics", desc: "Applied based on text layout" }, { tag: "vhal", name: "Alternate Vertical Half Metrics", desc: "Applied based on text layout" }, { tag: "curs", name: "Cursive Positioning", fixed: 1 }, { tag: "dist", name: "Distances", desc: "Like <kern> but not subject to discretionary disabling", fixed: 1 }, { tag: "kern", name: "Kerning", default: 1 }, { tag: "vkrn", name: "Vertical Kerning", desc: "Applied based on text layout", default: 1 }, { tag: "mark", name: "Mark Positioning", fixed: 1 }, { tag: "abvm", name: "Above-base Mark Positioning", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "blwm", name: "Below-base Mark Positioning", desc: "South and Southeast Asian scripts", fixed: 1 }, { tag: "mkmk", name: "Mark to Mark Positioning", desc: "Results may be subject to manual override or editing in some applications", fixed: 1 }, { tag: "aalt", name: "Access All Alternates", desc: "Only used by layout applications like InDesign to show/access the alternate characters." }, { tag: "size", name: "Optical Size", desc: "Deprecated" }]
				};
});
define("fontdrop/statics/waterfallTexts", ["exports"], function (exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
                value: true
        });
        exports.default = {
                'waterfallTexts': [{ id: "1", name: "A–Z", direction: "ltr", sample: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z . , : ; ! ?" }, { id: "2", name: "0–9", direction: "ltr", sample: "# 0 1 2 3 4 5 6 7 8 9 % + − × ÷ = < > ≤ ± ≥ € £ $ ¥ ¢ ¼ ½ ¾" }, { id: "3", name: "Boxing", direction: "ltr", sample: "the five boxing wizards jump quickly pack my red box with five dozen quality jugs a very big box sailed up then whizzed quickly from japan" }, { id: "4", name: "The Fox", direction: "ltr", sample: "The quick brown fox jumps over the lazy dog." }, { id: "5", name: "Arabic", direction: "rtl", sample: "نص حكيم له سر قاطع وذو شأن عظيم مكتوب على ثوب أخضر ومغلف بجلد أزرق" }, { id: "6", name: "Armenian", direction: "ltr", sample: "Բել դղյակի ձախ ժամն օֆ ազգությանը ցպահանջ չճշտած վնաս էր և փառք" }, { id: "7", name: "Cyrillic", direction: "ltr", sample: "Съешь же ещё этих мягких французских булок, да выпей чаю. S’eš’ že eŝë ètih mjagkih francuzskih bulok, da vypej čaju." }, { id: "8", name: "Devanagari", direction: "ltr", sample: "ऋषियों को सताने वाले दुष्ट राक्षसों के ज्ञानी राजा रावण का सर्वनाश करने वाले विष्णुवतार भगवान श्रीराम, अयोध्या के महाराज दशरथ के बड़े सपुत्र थे।" }, { id: "9", name: "Greek", direction: "ltr", sample: "Ταχίστη αλώπηξ βαφής ψημένη γη, δρασκελίζει υπέρ νωθρού κυνός Takhístè alôpèx vaphês psèménè gè, draskelízei ypér nòthroý kynós" }, { id: "10", name: "Hebrew", direction: "rtl", sample: "עטלף אבק נס דרך מזגן שהתפוצץ כי חם" }, { id: "11", name: "Vietnamese", direction: "ltr", sample: "Do bạch kim rất quý nên sẽ dùng để lắp vô xương." }]
        };
});
define("fontdrop/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Typ8s16L", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[6,\"header\"],[9,\"id\",\"site-header\"],[9,\"class\",\"clearfix\"],[7],[0,\"\\n\\n\"],[4,\"highlight-bar\",null,null,{\"statements\":[],\"parameters\":[]},null],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \\n                \"],[6,\"h1\"],[9,\"id\",\"site-title\"],[9,\"class\",\"left\"],[7],[4,\"link-to\",[\"application\"],[[\"target\"],[\"_blank\"]],{\"statements\":[[0,\"FontDrop!\"]],\"parameters\":[]},null],[8],[0,\"\\n\\n        \\t       \"],[6,\"div\"],[9,\"class\",\"info-modal right\"],[7],[0,\"\\n\\n                        \"],[6,\"div\"],[9,\"id\",\"dark-mode-switch\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"switch small round\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'DarkMode', 'Dark']);\"],[7],[0,\"\\n                                \"],[6,\"input\"],[9,\"id\",\"darkmodeSwitch\"],[9,\"type\",\"checkbox\"],[10,\"checked\",[18,\"darkmode\"],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"darkmode\"],null],null],[7],[8],[0,\"\\n                                \"],[6,\"label\"],[9,\"for\",\"darkmodeSwitch\"],[9,\"title\",\"Change background color\"],[7],[8],[0,\"\\n                            \"],[8],[0,\" \\n                        \"],[8],[0,\"\\n\\n\"],[4,\"info-modal\",null,[[\"languageData\",\"otFeatures\"],[[20,[\"languageData\"]],[20,[\"otFeatures\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n        \\t       \"],[8],[0,\"\\n\\n            \"],[8],[0,\"\\n\\n\\t\"],[8],[0,\"\\n\\n\\n    \"],[6,\"article\"],[7],[0,\"\\n\\n        \"],[1,[18,\"outlet\"],false],[0,\"\\n\\n    \"],[8],[0,\"\\n\\n\\n    \"],[6,\"footer\"],[9,\"id\",\"site-footer\"],[7],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"site-info columns medium-8 large-12\"],[7],[0,\"\\n                \"],[6,\"span\"],[7],[0,\"Using \"],[6,\"i\"],[7],[0,\"FontDrop!\"],[8],[0,\" regulary? \"],[6,\"a\"],[9,\"href\",\"https://buymeacoffee.com/fontdrop\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Consider supporting the maintenance and development with a small donation!\"],[8],[8],[0,\"\\n                \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[7],[0,\"More \"],[6,\"i\"],[7],[0,\"FontDrop!\"],[8],[0,\" tools: \"],[6,\"a\"],[9,\"href\",\"#/compare\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Compare\"],[8],[0,\" and \"],[6,\"a\"],[9,\"href\",\"#/languages\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Language Report\"],[8],[8],[0,\"\\n                \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                A project by \"],[6,\"a\"],[9,\"href\",\"https://viktornuebel.com\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Viktor Nübel Type Design\"],[8],[0,\" in collaboration with \"],[6,\"a\"],[9,\"href\",\"http://www.lieberungewoehnlich.de/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Clemens Nübel\"],[8],[0,\". \"],[6,\"br\"],[7],[8],[0,\"\\n                Follow on \"],[6,\"a\"],[9,\"href\",\"https://typo.social/@workingwithtype\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"me\"],[7],[0,\"Mastodon\"],[8],[0,\". \"],[6,\"a\"],[9,\"class\",\"privacy\"],[9,\"href\",\"https://www.viktornuebel.com/privacy-policy/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Privacy Policy\"],[8],[0,\"\\n                \"],[6,\"br\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"columns medium-4\"],[7],[0,\" \\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n                \\n\"],[4,\"scroll-to-top\",null,null,{\"statements\":[],\"parameters\":[]},null],[0,\"\\n    \"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/application.hbs" } });
});
define("fontdrop/templates/compare", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gX5MBOFE", "block": "{\"symbols\":[],\"statements\":[[0,\"\\t\"],[6,\"div\"],[9,\"class\",\"row page-compare\"],[7],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-5 columns\"],[7],[0,\"\\n\"],[4,\"compare-drop-one\",null,[[\"id\",\"send\",\"fontOne\"],[\"compareDropOne\",[25,\"action\",[[19,0,[]],\"changeFontOne\"],null],[20,[\"fontOne\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-2 columns\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"versus\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"versus-content\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"span\"],[7],[0,\"VS\"],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-5 columns\"],[7],[0,\"\\n\"],[4,\"compare-drop-two\",null,[[\"id\"],[\"compareDropTwo\"]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"h2\"],[7],[0,\"Compare\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\"],[4,\"compare-info\",null,[[\"fontOne\",\"compareTexts\",\"waterfallTexts\"],[[20,[\"fontOne\"]],[20,[\"compareTexts\"]],[20,[\"waterfallTexts\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\\t\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/compare.hbs" } });
});
define("fontdrop/templates/components/compare-characters", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3v9yc1cf", "block": "{\"symbols\":[\"character\"],\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[7],[0,\"\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"OTnote\"],[7],[0,\"\\n\\t\\t\\tAll \"],[6,\"b\"],[7],[1,[20,[\"allCharacters\",\"length\"]],false],[0,\" unicode encoded characters\"],[8],[0,\" in the first font compared with the second one.\"],[6,\"br\"],[7],[8],[0,\"\\n\\t\\t\\tThe shown characters depend on the font file you drop in the first field!\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"allCharacters\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"div\"],[9,\"class\",\"characterItem\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"compareFontOne\"],[7],[1,[19,1,[]],false],[8],[6,\"span\"],[9,\"class\",\"compareFontTwo\"],[7],[1,[19,1,[]],false],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/compare-characters.hbs" } });
});
define("fontdrop/templates/components/compare-drop-one", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "1cyUZ6qJ", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"dropField compareDropField\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"drop-font-file\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"h2\"],[7],[0,\"Drop One Font Here!\"],[8],[6,\"br\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"upload-font-file\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"input\"],[9,\"id\",\"file\"],[9,\"type\",\"file\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"uploadFontCompareOne\"],null],null],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"label\"],[9,\"for\",\"file\"],[7],[6,\"span\"],[7],[0,\"Or choose a file\"],[8],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"fileName\"],[7],[6,\"span\"],[9,\"class\",\"fontFullNameOne\"],[7],[1,[18,\"fontFullNameOne\"],false],[8],[6,\"br\"],[7],[8],[6,\"i\"],[7],[1,[18,\"fontVersionOne\"],false],[8],[6,\"br\"],[7],[8],[6,\"span\"],[9,\"id\",\"messageOne\"],[7],[8],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"id\",\"uploadedFontCompareOne\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/compare-drop-one.hbs" } });
});
define("fontdrop/templates/components/compare-drop-two", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3tpqn9eJ", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"dropField compareDropField\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"drop-font-file\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"h2\"],[7],[0,\"Drop Another Font Here!\"],[8],[6,\"br\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"upload-font-file\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"input\"],[9,\"id\",\"fileTwo\"],[9,\"type\",\"file\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"uploadFontCompareTwo\"],null],null],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"label\"],[9,\"for\",\"fileTwo\"],[7],[6,\"span\"],[7],[0,\"Or choose a file\"],[8],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"fileName\"],[7],[6,\"span\"],[9,\"class\",\"fontFullNameTwo\"],[7],[1,[18,\"fontFullNameTwo\"],false],[8],[6,\"br\"],[7],[8],[6,\"i\"],[7],[1,[18,\"fontVersionTwo\"],false],[8],[6,\"br\"],[7],[8],[6,\"span\"],[9,\"id\",\"messageTwo\"],[7],[8],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"id\",\"uploadedFontCompareTwo\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/compare-drop-two.hbs" } });
});
define("fontdrop/templates/components/compare-info", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "U+PkQxhW", "block": "{\"symbols\":[\"waterfallFontSize\",\"waterfallText\",\"compare\"],\"statements\":[[0,\"\\n\\t\\t\"],[6,\"ul\"],[9,\"class\",\"tabs\"],[9,\"data-tab\",\"\"],[9,\"role\",\"tablist\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title active\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Compare', 'Text']);\"],[7],[6,\"a\"],[9,\"href\",\"#text\"],[7],[0,\"Text\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Compare', 'Waterfall']);\"],[7],[6,\"a\"],[9,\"href\",\"#waterfall\"],[7],[0,\"Waterfall\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Compare', 'Characters']);\"],[7],[6,\"a\"],[9,\"href\",\"#characters\"],[7],[0,\"Characters\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Compare', 'Tables']);\"],[7],[6,\"a\"],[9,\"href\",\"#tables\"],[7],[0,\"Data\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Compare', 'About']);\"],[7],[6,\"a\"],[9,\"href\",\"#about\"],[7],[0,\"About Compare\"],[8],[8],[0,\"\\n\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"tabs-content\"],[7],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"text\"],[9,\"class\",\"content active\"],[7],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"compareTexts\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button round tiny secondary\"],[10,\"title\",[19,3,[\"sample\"]],null],[3,\"action\",[[19,0,[]],\"setCompare\",[19,3,[\"id\"]]]],[7],[1,[19,3,[\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"\\n\\t\\t\\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"10px \"],[8],[0,\" \"],[1,[18,\"fontFullNameOne\"],false],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:10px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\t\\t \\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"10px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:10px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"12px \"],[8],[0,\" \"],[1,[18,\"fontFullNameOne\"],false],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:12px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\t\\t \\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"12px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:12px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"14px \"],[8],[0,\" \"],[1,[18,\"fontFullNameOne\"],false],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:14px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\t\\t \\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"14px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:14px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"16px \"],[8],[0,\" \"],[1,[18,\"fontFullNameOne\"],false],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:16px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\t\\t \\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"16px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:16px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t            \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"18px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:18px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"18px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:18px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"20px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:20px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\t\\t \\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"20px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:20px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t \\t\\t\"],[8],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\t\\t    \\n\\t\\t\\t\\t    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"22px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontOne\"],[9,\"style\",\"font-size:22px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"22px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText compareFontTwo\"],[9,\"style\",\"font-size:22px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"compareText\"],false],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"waterfall\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"waterfallTexts\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button round tiny secondary\"],[10,\"title\",[19,2,[\"sample\"]],null],[3,\"action\",[[19,0,[]],\"setWaterfall\",[19,2,[\"id\"]]]],[7],[1,[19,2,[\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"id\",\"type\",\"name\",\"class\",\"key-up\",\"placeholder\"],[\"textFieldWaterfall\",\"text\",\"ownWaterfall\",\"radius\",\"updateWaterfallText\",\"Your text here...\"]]],false],[0,\"\\n\\n\\t\\t \\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"waterfall\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"waterfallFontSizes\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[9,\"dir\",\"auto\"],[7],[1,[19,1,[]],false],[0,\"px\"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"waterfallText compareFontOne\"],[10,\"dir\",[18,\"waterfallDirection\"],null],[10,\"style\",[25,\"waterfall-style\",[[19,1,[]]],null],null],[7],[1,[18,\"waterfallLine\"],false],[8],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[7],[6,\"div\"],[9,\"class\",\"waterfallText compareFontTwo\"],[10,\"dir\",[18,\"waterfallDirection\"],null],[10,\"style\",[25,\"waterfall-style\",[[19,1,[]]],null],null],[7],[1,[18,\"waterfallLine\"],false],[8],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"characters\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\n\"],[4,\"compare-characters\",null,[[\"fontOne\"],[[20,[\"fontOne\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"tables\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"table-data\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"i\"],[7],[0,\"Soon...\"],[8],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"about\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-8 columns\"],[7],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"About Compare\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Use this page to  compare two fonts. First hand this is for viewing text side by side. \"],[6,\"br\"],[7],[8],[0,\" If you want to compare the details of font files, you can use the regular \"],[6,\"b\"],[7],[0,\"FontDrop!\"],[8],[0,\" website with two browser tabs.\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/compare-info.hbs" } });
});
define("fontdrop/templates/components/font-data", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hIzbmsUw", "block": "{\"symbols\":[],\"statements\":[[0,\"\\t\\n\\t\"],[6,\"p\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"fullName\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t    Name: \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"fullName\",\"en\"]],false],[8],[0,\".\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"preferredSubfamily\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t    Style name: \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"preferredSubfamily\",\"en\"]],false],[8],[0,\".\\n\"]],\"parameters\":[]},null],[0,\"\\n\\t\\t\"],[4,\"if\",[[25,\"eq\",[[20,[\"font\",\"tables\",\"post\",\"isFixedPitch\"]],1],null]],null,{\"statements\":[[0,\"This is a \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[0,\"monospaced\"],[8],[0,\" font.\"]],\"parameters\":[]},null],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"font\",\"tables\",\"name\",\"version\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t  \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"tables\",\"name\",\"version\",\"en\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t \\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"designerURL\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t  \"],[6,\"br\"],[7],[8],[0,\"It was designed by \"],[6,\"a\"],[10,\"href\",[26,[[25,\"check-url\",[[20,[\"font\",\"names\",\"designerURL\",\"en\"]]],null]]]],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"designer\",\"en\"]],false],[8],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"font\",\"names\",\"designer\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t  \"],[6,\"br\"],[7],[8],[0,\"It was designed by \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"designer\",\"en\"]],false],[8],[0,\"\\n\\t\\t\"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"\\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"manufacturerURL\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t   \"],[6,\"span\"],[7],[0,\"  Manufacturer: \"],[6,\"a\"],[10,\"href\",[26,[[25,\"check-url\",[[20,[\"font\",\"names\",\"manufacturerURL\",\"en\"]]],null]]]],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"manufacturer\",\"en\"]],false],[8],[8],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"font\",\"names\",\"manufacturer\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t  \"],[6,\"span\"],[7],[0,\"  Manufacturer: \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"manufacturer\",\"en\"]],false],[8],[8],[0,\"\\n\\t\\t\"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"\\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"copyright\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t  \"],[6,\"br\"],[7],[8],[0,\"© \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"copyright\",\"en\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t        \\n\"],[0,\"\\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"license\",\"en\"]]],null,{\"statements\":[[4,\"read-more\",null,[[\"maxHeight\",\"openText\"],[\"42px\",\"Read on ...\"]],{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"font-license\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"br\"],[7],[8],[0,\"License:\\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"licenseURL\",\"en\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[25,\"check-url\",[[20,[\"font\",\"names\",\"licenseURL\",\"en\"]]],null]]]],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"license\",\"en\"]],false],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"names\",\"license\",\"en\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"\\n\\t\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-data.hbs" } });
});
define("fontdrop/templates/components/font-drop", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NhymsvFc", "block": "{\"symbols\":[\"&default\"],\"statements\":[[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                  \"],[6,\"div\"],[9,\"class\",\"dropField\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"id\",\"parsingFont\"],[7],[0,\"\\n                              \"],[6,\"div\"],[9,\"class\",\"loadingRing\"],[7],[8],[0,\"\\n                              \"],[6,\"div\"],[9,\"class\",\"fileName pulsate\"],[7],[0,\"Parsing...\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"drop-font-file\"],[7],[0,\"\\n                              \"],[6,\"h2\"],[7],[0,\"Drop your font file!\"],[8],[6,\"br\"],[7],[8],[0,\"\\n                              \"],[6,\"span\"],[9,\"class\",\"upload-font-file\"],[7],[0,\"\\n                                          \"],[6,\"input\"],[9,\"id\",\"file\"],[9,\"type\",\"file\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"uploadFont\"],null],null],[7],[8],[0,\"\\n                                          \"],[6,\"label\"],[9,\"for\",\"file\"],[7],[6,\"span\"],[7],[0,\"Or choose a file\"],[8],[8],[0,\"\\n                                          \"],[6,\"div\"],[9,\"class\",\"fileName\"],[7],[6,\"span\"],[9,\"id\",\"message\"],[7],[6,\"i\"],[7],[0,\"(Files are not uploaded to a server!)\"],[8],[8],[6,\"span\"],[9,\"id\",\"fileSize\"],[7],[8],[8],[0,\"\\n                              \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                  \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\\n            \"],[6,\"div\"],[9,\"id\",\"uploadedFont\"],[7],[8],[0,\"\\n\\n\"],[11,1]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-drop.hbs" } });
});
define("fontdrop/templates/components/font-info", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "T+wOwfPT", "block": "{\"symbols\":[\"waterfallFontSize\",\"waterfallText\",\"specimen\",\"id\",\"gposfeautre\",\"feature\",\"content\",\"id\",\"glyph\",\"feature\",\"content\",\"index\",\"ligature\",\"id\",\"g\",\"index\",\"glyph\"],\"statements\":[[0,\"   \\n                \"],[6,\"ul\"],[9,\"class\",\"tabs\"],[9,\"data-tab\",\"\"],[9,\"role\",\"tablist\"],[7],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title active\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'Glyphs']);\"],[7],[6,\"a\"],[9,\"href\",\"#glyphs\"],[7],[0,\"Glyphs\"],[8],[8],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'Ligatures']);\"],[7],[6,\"a\"],[9,\"href\",\"#ligatures\"],[7],[0,\"Ligatures\"],[8],[8],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'OT']);\"],[7],[6,\"a\"],[9,\"href\",\"#ot-details\"],[9,\"class\",\"ot-details\"],[7],[0,\"OT\"],[8],[8],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'Specimen']);\"],[7],[6,\"a\"],[9,\"href\",\"#specimen\"],[7],[0,\"Text\"],[8],[8],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'Waterfalll']);\"],[7],[6,\"a\"],[9,\"href\",\"#waterfall\"],[7],[0,\"Waterfall\"],[8],[8],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'Typing']);\"],[7],[6,\"a\"],[9,\"href\",\"#typing\"],[7],[0,\"Type Yourself\"],[8],[8],[0,\"\\n                    \"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Tabs', 'Meta Data']);\"],[7],[6,\"a\"],[9,\"href\",\"#table-data\"],[7],[0,\"Data\"],[8],[8],[0,\"\\n                \"],[8],[0,\"\\n\\n\\n                \"],[6,\"div\"],[9,\"class\",\"tabs-content\"],[7],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content active\"],[9,\"id\",\"glyphs\"],[7],[0,\"\\n\\n                        \"],[6,\"p\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"font\",\"tables\",\"maxp\",\"numGlyphs\"]]],null,{\"statements\":[[0,\"                                The font \"],[1,[20,[\"font\",\"names\",\"fontFamily\",\"en\"]],false],[0,\" contains \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[20,[\"font\",\"tables\",\"maxp\",\"numGlyphs\"]],false],[8],[0,\" glyphs\\n\"]],\"parameters\":[]},null],[0,\"                                \"],[6,\"span\"],[9,\"id\",\"kerningPairs\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                                \"],[6,\"span\"],[9,\"class\",\"note\"],[7],[6,\"i\"],[7],[0,\"Note:\"],[8],[0,\" Glyphs shown here are not affected if you switch on/off detected OpenType features or font variations settings (Variable Fonts).\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\\n                        \"],[6,\"div\"],[9,\"id\",\"glyph-list-end\"],[7],[0,\"\\n\"],[4,\"each\",[[25,\"-each-in\",[[20,[\"font\",\"glyphs\",\"glyphs\"]]],null]],null,{\"statements\":[[0,\"\\n\"],[4,\"glyph-item\",null,[[\"index\",\"font\",\"glyph\"],[[19,16,[]],[20,[\"font\"]],[19,17,[]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[16,17]},null],[0,\"                        \"],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content\"],[9,\"id\",\"ligatures\"],[7],[0,\"\\n\\n                        \"],[6,\"p\"],[7],[0,\"\\n                            The font \"],[1,[20,[\"font\",\"names\",\"fontFamily\",\"en\"]],false],[0,\" contains \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[18,\"ligatureCount\"],false],[8],[0,\" ligatures in \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[1,[18,\"ligatureFeaturesCount\"],false],[8],[0,\" OpenType features\"],[6,\"br\"],[7],[8],[0,\"\\n                             \"],[6,\"span\"],[9,\"class\",\"note\"],[7],[0,\"Ligatures and their component characters (not affected by OpenType switches or font variations settings).\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\\n                        \"],[6,\"div\"],[9,\"id\",\"ligatureList\"],[7],[0,\"\\n\"],[4,\"each\",[[25,\"-each-in\",[[20,[\"ligatureListNew\"]]],null]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"ligaFeature\"],[7],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"b\"],[7],[1,[19,10,[]],false],[8],[0,\" – \"],[1,[19,11,[\"name\",\"name\"]],false],[0,\" \"],[8],[0,\"\\n\"],[4,\"each\",[[25,\"-each-in\",[[19,11,[\"glyphlist\"]]],null]],null,{\"statements\":[[0,\"                                        \"],[6,\"div\"],[9,\"class\",\"ligatureItem\"],[7],[0,\"\\n\"],[4,\"ligature-item\",null,[[\"glyphindex\",\"font\"],[[19,13,[\"ligaG\"]],[20,[\"font\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"                                            \"],[6,\"dl\"],[7],[0,\"\\n                                                \"],[6,\"dt\"],[7],[0,\"Name\"],[8],[6,\"dd\"],[7],[1,[19,13,[\"ligaName\"]],false],[8],[0,\"\\n                                                \"],[6,\"dt\"],[7],[0,\"Components\"],[8],[6,\"dd\"],[9,\"class\",\"ligComp\"],[7],[4,\"each\",[[25,\"-each-in\",[[19,13,[\"comp\"]]],null]],null,{\"statements\":[[6,\"span\"],[7],[1,[19,15,[]],false],[8]],\"parameters\":[14,15]},null],[8],[0,\"\\n                                            \"],[8],[0,\"\\n                                        \"],[8],[0,\"\\n\"]],\"parameters\":[12,13]},null],[0,\"                                \"],[8],[0,\"\\n\"]],\"parameters\":[10,11]},null],[0,\"                        \"],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content\"],[9,\"id\",\"ot-details\"],[7],[0,\"\\n\\n                        \"],[6,\"p\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"substituteListNew\"]]],null,{\"statements\":[[0,\"                                The font \"],[1,[20,[\"font\",\"names\",\"fontFamily\",\"en\"]],false],[0,\" contains OpenType features with alternates or substitutes\"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                The font \"],[1,[20,[\"font\",\"names\",\"fontFamily\",\"en\"]],false],[0,\" contains \"],[6,\"span\"],[9,\"class\",\"info-highlight\"],[7],[0,\"no substitute letters\"],[8],[6,\"br\"],[7],[8],[0,\"                            \\n\"]],\"parameters\":[]}],[0,\"                             \"],[6,\"span\"],[9,\"class\",\"note\"],[7],[0,\"The first character is the input character in grey/violette, followed by the substitute or alternate character in black.\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\\n                        \"],[6,\"div\"],[9,\"id\",\"otList\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"substituteListNew\"]]],null,{\"statements\":[[4,\"each\",[[25,\"-each-in\",[[20,[\"substituteListNew\"]]],null]],null,{\"statements\":[[0,\"                                    \"],[6,\"p\"],[7],[6,\"b\"],[7],[1,[19,6,[]],false],[8],[0,\" — \"],[1,[19,7,[\"name\",\"name\"]],false],[0,\" \"],[6,\"span\"],[9,\"class\",\"note\"],[7],[1,[19,7,[\"name\",\"desc\"]],false],[8],[8],[0,\"\\n                                        \"],[6,\"div\"],[9,\"class\",\"substituteItems droppedFont\"],[9,\"dir\",\"auto\"],[7],[0,\"\\n\"],[4,\"unless\",[[19,7,[\"unique\"]]],null,{\"statements\":[[0,\"                                                \"],[6,\"span\"],[9,\"class\",\"note\"],[7],[0,\"Note: This contains no unicode characters, probably it is substitutes of substitutes.\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"each\",[[25,\"-each-in\",[[19,7,[\"unique\"]]],null]],null,{\"statements\":[[0,\"                                                \"],[6,\"span\"],[9,\"class\",\"coverGlyph\"],[7],[1,[19,9,[]],false],[8],[0,\"\\n                                                \"],[6,\"span\"],[9,\"class\",\"feaGlyph\"],[10,\"style\",[26,[\"font-feature-settings:'\",[19,6,[]],\"' on;\"]]],[7],[4,\"if\",[[25,\"eq\",[[19,6,[]],\"medi\"],null]],null,{\"statements\":[[0,\"‍‍\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,6,[]],\"fina\"],null]],null,{\"statements\":[[0,\"‍‍\"]],\"parameters\":[]},null],[1,[19,9,[]],false],[4,\"if\",[[25,\"eq\",[[19,6,[]],\"medi\"],null]],null,{\"statements\":[[0,\"‍‍\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,6,[]],\"init\"],null]],null,{\"statements\":[[0,\"‍‍\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[19,8,[]],\"499\"],null]],null,{\"statements\":[[0,\"                                                    \"],[6,\"span\"],[9,\"class\",\"note\"],[7],[0,\"Note: This is limited to 500 combinations for a better performance.\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[8,9]},null],[0,\"                                        \"],[8],[0,\"\\n                                    \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[6,7]},null],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"otherLookups\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"hr\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"gposFeatures\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"hr\"],[7],[8],[0,\"\\n                            \"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"\\n\"],[4,\"if\",[[20,[\"otherLookups\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"OTnote\"],[7],[0,\"\\n                                    \"],[6,\"h4\"],[7],[0,\"There is more..\"],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[0,\"Note: It seems that there is some more OpenType magic in this font that we currently do not parse.\\n                                    This might be subsitutes of subsitutes or some more complex feature lookups or lookup exceptions.\"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"gposFeatures\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"OTnote\"],[7],[0,\"\\n                                    \"],[6,\"h4\"],[7],[0,\"GPOS Features\"],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[0,\"Note: All the OpenType Features shown here are stored in the \"],[6,\"i\"],[7],[0,\"Glyph Substitution Table\"],[8],[0,\" (\"],[6,\"a\"],[9,\"href\",\"https://docs.microsoft.com/de-de/typography/opentype/spec/gsub\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"GSUB\"],[8],[0,\"). \\n                                    This font also contains OpenType Features in the \"],[6,\"i\"],[7],[0,\"Glyph Positioning Table\"],[8],[0,\" (\"],[6,\"a\"],[9,\"href\",\"https://docs.microsoft.com/de-de/typography/opentype/spec/gpos\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"GPOS\"],[8],[0,\") which are not visualized here.\\n                                    Use the OpenType Feature switches at the top to examine the effect of these features:\\n\"],[4,\"each\",[[25,\"-each-in\",[[20,[\"gposFeatureList\"]]],null]],null,{\"statements\":[[0,\"                                            \"],[6,\"span\"],[7],[0,\"• \"],[6,\"b\"],[7],[1,[19,5,[]],false],[8],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[4,5]},null],[0,\"                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[8],[0,\"\\n\\n                    \"],[8],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content\"],[9,\"id\",\"specimen\"],[7],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"specimenTexts\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"button\"],[9,\"class\",\"button round tiny secondary\"],[10,\"title\",[19,3,[\"sample\"]],null],[3,\"action\",[[19,0,[]],\"setSpecimen\",[19,3,[\"id\"]]]],[7],[1,[19,3,[\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[4,\"if\",[[20,[\"fontInfoSpecimenTexts\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"button\"],[9,\"class\",\"button round tiny secondary\"],[10,\"title\",[18,\"fontInfoSpecimenTexts\"],null],[3,\"action\",[[19,0,[]],\"setSpecimen\",100]],[7],[0,\"Font Sample Text\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"large-12 columns\"],[7],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"24px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:24px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"18px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:18px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"17px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:17px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"16px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:16px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"15px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:15px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                \"],[8],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"14px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:14px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"13px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:13px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"12px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:12px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"11px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:11px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                    \"],[6,\"p\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[10,\"dir\",[18,\"direction\"],null],[7],[0,\"10px \"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"specimenText droppedFont\"],[9,\"style\",\"font-size:10px;\"],[10,\"dir\",[18,\"direction\"],null],[7],[1,[18,\"specimenText\"],false],[8],[8],[0,\"\\n                                \"],[8],[0,\"\\n      \\n                    \"],[8],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content\"],[9,\"id\",\"waterfall\"],[7],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"waterfallTexts\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"button\"],[9,\"class\",\"button round tiny secondary\"],[10,\"title\",[19,2,[\"sample\"]],null],[3,\"action\",[[19,0,[]],\"setWaterfall\",[19,2,[\"id\"]]]],[7],[1,[19,2,[\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"id\",\"type\",\"name\",\"class\",\"key-up\",\"placeholder\"],[\"textFieldWaterfall\",\"text\",\"ownWaterfall\",\"radius\",\"updateWaterfallText\",\"Your text here...\"]]],false],[0,\"\\n         \\n                            \"],[6,\"div\"],[9,\"class\",\"waterfall\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"waterfallFontSizes\"]]],null,{\"statements\":[[0,\"                                  \"],[6,\"div\"],[7],[6,\"div\"],[9,\"class\",\"waterfallFontSize\"],[9,\"dir\",\"auto\"],[7],[1,[19,1,[]],false],[0,\"px\"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"div\"],[9,\"class\",\"waterfallText droppedFont\"],[10,\"dir\",[18,\"waterfallDirection\"],null],[10,\"style\",[25,\"waterfall-style\",[[19,1,[]]],null],null],[7],[1,[18,\"waterfallLine\"],false],[8],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                            \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content\"],[9,\"id\",\"typing\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"small-12 large-8 columns\"],[7],[0,\"\\n                                    \"],[6,\"label\"],[7],[6,\"span\"],[7],[0,\"Font Size\"],[8],[0,\" \"],[6,\"span\"],[7],[1,[18,\"typeYourselfFontSize\"],false],[0,\"px\"],[8],[0,\" \"],[1,[25,\"x-range-input\",null,[[\"id\",\"class\",\"name\",\"min\",\"max\",\"step\",\"value\",\"action\"],[\"font-size\",\"rslider\",\"fontSizeSlider\",6,300,2,[20,[\"typeYourselfFontSize\"]],[25,\"action\",[[19,0,[]],\"updateFontSize\"],null]]]],false],[8],[0,\" \\n                            \"],[8],[6,\"div\"],[9,\"class\",\"small-12 large-4 columns\"],[7],[0,\"\\n                                    \"],[6,\"label\"],[7],[6,\"span\"],[7],[0,\"Line Height\"],[8],[0,\" \"],[6,\"span\"],[7],[1,[18,\"typeYourselfLineHeight\"],false],[8],[1,[25,\"x-range-input\",null,[[\"id\",\"class\",\"name\",\"min\",\"max\",\"step\",\"value\",\"action\"],[\"line-height\",\"rslider\",\"lineHeightSlider\",0.1,2,0.1,[20,[\"typeYourselfLineHeight\"]],[25,\"action\",[[19,0,[]],\"updateLineHeight\"],null]]]],false],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"p\"],[9,\"contenteditable\",\"true\"],[9,\"class\",\"droppedFont\"],[9,\"dir\",\"auto\"],[10,\"style\",[18,\"contenteditableStyleHtml\"],null],[7],[0,\"Type here... \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\\n\\n                    \"],[6,\"div\"],[9,\"class\",\"content\"],[9,\"id\",\"table-data\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/name.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"name\"],[8],[0,\" – Naming Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"name-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/head.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"head\"],[8],[0,\" – Font Header Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"head-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/hhea.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"hhea\"],[8],[0,\" – Horizontal Header Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"hhea-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/maxp.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"maxp\"],[8],[0,\" – Maximum Profile Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"maxp-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/otspec/kern.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"kern\"],[8],[0,\" – Kerning Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"kern-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/GSUB.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"GSUB\"],[8],[0,\" – Glyph Substitution Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"gsub-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                        \"],[8],[6,\"div\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/os2.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"OS/2\"],[8],[0,\" – OS/2 and Windows Metrics Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"os2-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/post.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"post\"],[8],[0,\" – PostScript Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"post-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/cmap.htm\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"cmap\"],[8],[0,\" – Character To Glyph Index Mapping Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"cmap-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fvar.html\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"fvar\"],[8],[0,\" – Font Variations Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"fvar-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"\\n                            \"],[6,\"h4\"],[7],[6,\"a\"],[9,\"href\",\"https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"meta\"],[8],[0,\" – Metadata Table\"],[8],[0,\"\\n                                    \"],[6,\"dl\"],[9,\"id\",\"meta-table\"],[7],[6,\"dt\"],[7],[0,\"Undefined\"],[8],[8],[0,\"       \\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\\n                \"],[8],[0,\"\\n\\n\\n                \"],[6,\"div\"],[9,\"id\",\"glyphModal\"],[9,\"class\",\"reveal-modal\"],[9,\"data-reveal\",\"\"],[9,\"aria-hidden\",\"true\"],[7],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"id\",\"glyph-display\"],[7],[0,\"\\n                            \"],[6,\"canvas\"],[9,\"id\",\"glyph-detail\"],[9,\"width\",\"500\"],[9,\"height\",\"500\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n\\n                    \"],[6,\"div\"],[9,\"id\",\"glyph-item-data\"],[7],[8],[0,\"\\n\\n                    \"],[6,\"a\"],[9,\"class\",\"close-reveal-modal\"],[9,\"aria-label\",\"Close\"],[7],[0,\"×\"],[8],[0,\"\\n                    \\n                \"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-info.hbs" } });
});
define("fontdrop/templates/components/font-languages", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lo86ybu7", "block": "{\"symbols\":[\"language\"],\"statements\":[[0,\"\\t\\t\\t\\n\\t\"],[6,\"div\"],[9,\"id\",\"fontLanguages\"],[9,\"class\",\"clearfix\"],[7],[0,\"\\t\\n\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"ot-feature-head\"],[7],[0,\"Support for \"],[6,\"b\"],[7],[1,[20,[\"fontLanguages\",\"length\"]],false],[8],[0,\" languages detected \"],[6,\"br\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"fontLanguages\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"languageItem\"],[7],[1,[19,1,[]],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-languages.hbs" } });
});
define("fontdrop/templates/components/font-otfeatures", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ez7uI30T", "block": "{\"symbols\":[\"feature\"],\"statements\":[[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"id\",\"ot-features\"],[9,\"class\",\"clearfix\"],[7],[0,\"\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"ot-features-exist\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"p\"],[9,\"class\",\"ot-feature-head\"],[7],[6,\"b\"],[7],[1,[20,[\"otFeaDetected\",\"length\"]],false],[8],[0,\" OpenType features were detected in the font\"],[8],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"otFeaDetected\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"featureItem\"],[7],[0,\"\\n\\t\\t                \"],[6,\"span\"],[7],[1,[19,1,[\"tag\"]],false],[8],[0,\"\\n\\t\\t                \"],[6,\"div\"],[9,\"class\",\"switch small round\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[19,1,[\"default\"]],1],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"input\"],[10,\"id\",[26,[[19,1,[\"tag\"]],\"Switch\"]]],[9,\"type\",\"checkbox\"],[9,\"checked\",\"\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"switchOTfeature\",[19,1,[\"tag\"]]],null],null],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"input\"],[10,\"id\",[26,[[19,1,[\"tag\"]],\"Switch\"]]],[9,\"type\",\"checkbox\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"switchOTfeature\",[19,1,[\"tag\"]]],null],null],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"label\"],[10,\"for\",[26,[[19,1,[\"tag\"]],\"Switch\"]]],[10,\"title\",[26,[[19,1,[\"name\"]],\" Feature\"]]],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\" \\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"style\"],[7],[0,\"\\n\\t\\t.droppedFont { \\n\\t\\t\\tfont-feature-settings: \"],[1,[18,\"featureSettingsOff\"],false],[4,\"if\",[[20,[\"featureSettingsOff\"]]],null,{\"statements\":[[0,\", \"]],\"parameters\":[]},null],[1,[18,\"featureSettingsOn\"],false],[0,\"; \\n\\t\\t}\\n\\t\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-otfeatures.hbs" } });
});
define("fontdrop/templates/components/font-preview", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "xFVF+CTk", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[6,\"canvas\"],[9,\"id\",\"preview\"],[9,\"width\",\"940\"],[9,\"height\",\"300\"],[9,\"class\",\"text\"],[7],[8],[0,\"\\n\\n\\t\"],[1,[25,\"input\",null,[[\"type\",\"key-press\",\"value\",\"id\"],[\"text\",\"renderText\",[20,[\"text\"]],\"textField\"]]],false],[0,\"\\n\\n\\t\"],[6,\"label\"],[7],[0,\"Font Size \"],[1,[25,\"x-range-input\",null,[[\"id\",\"name\",\"min\",\"max\",\"step\",\"value\",\"action\"],[\"font-size-range\",\"fontSizeSlider\",6,300,2,[20,[\"fontSize\"]],[25,\"action\",[[19,0,[]],\"updateFontSize\"],null]]]],false],[0,\" \"],[6,\"span\"],[9,\"id\",\"fontSize\"],[7],[1,[18,\"fontSize\"],false],[8],[8],[0,\"\\n\\t\"],[6,\"label\"],[7],[1,[25,\"input\",null,[[\"type\",\"name\",\"checked\"],[\"checkbox\",\"drawPoints\",[20,[\"drawPoints\"]]]]],false],[0,\"Draw Points\"],[8],[0,\"\\n\\t\"],[6,\"label\"],[7],[1,[25,\"input\",null,[[\"type\",\"name\",\"checked\"],[\"checkbox\",\"drawMetrics\",[20,[\"drawMetrics\"]]]]],false],[0,\"Draw Metrics\"],[8],[0,\"\\n\\t\"],[6,\"label\"],[7],[1,[25,\"input\",null,[[\"type\",\"name\",\"checked\"],[\"checkbox\",\"kerning\",[20,[\"kerning\"]]]]],false],[0,\"Kerning\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-preview.hbs" } });
});
define("fontdrop/templates/components/font-variable-font", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vhTsdJYH", "block": "{\"symbols\":[\"instance\"],\"statements\":[[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"id\",\"variable-font-stuff\"],[7],[0,\"\\n\\n\\t\\t\"],[8],[0,\"\\n\\n\"],[4,\"if\",[[25,\"eq\",[[20,[\"isVariable\"]],true],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"instanceContainer\"],[9,\"class\",\"small-12 large-6 columns\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"p\"],[7],[0,\"The font has \"],[1,[18,\"instancesCount\"],false],[0,\" predefined instances:\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"vfInstances\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[10,\"id\",[26,[[19,1,[\"name\",\"en\"]]]]],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"setNamedInstance\",[19,1,[\"name\",\"en\"]]],null],null],[9,\"href\",\"#\"],[9,\"class\",\"button round tiny secondary\"],[7],[1,[19,1,[\"name\",\"en\"]],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"clearfix\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/font-variable-font.hbs" } });
});
define("fontdrop/templates/components/glyph-item-glyph", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Z90dxSl0", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/glyph-item-glyph.hbs" } });
});
define("fontdrop/templates/components/glyph-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8MJ6Z602", "block": "{\"symbols\":[\"popover\"],\"statements\":[[4,\"popover-on-component\",null,[[\"enableLazyRendering\"],[true]],{\"statements\":[[0,\"\\t\\tGlyph: \"],[1,[20,[\"glyph\",\"name\"]],false],[0,\" \"],[6,\"br\"],[7],[8],[0,\"\\n\\t\\tUnicode: \"],[1,[25,\"format-unicode\",[[20,[\"glyph\",\"unicodes\"]]],null],false],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n\"],[4,\"glyph-item-glyph\",null,[[\"index\",\"font\"],[[20,[\"index\"]],[20,[\"font\"]]]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/glyph-item.hbs" } });
});
define("fontdrop/templates/components/highlight-bar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "V0e93FI/", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[6,\"div\"],[9,\"id\",\"highlightBar\"],[10,\"class\",[26,[\"banner \",[18,\"showBanner\"]]]],[7],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\\t\\t\"],[6,\"span\"],[9,\"class\",\"news\"],[7],[6,\"i\"],[7],[0,\"Rethink\"],[8],[0,\" is now on Sale! \"],[6,\"a\"],[9,\"href\",\"https://www.myfonts.com/de/collections/rethink-font-viktor-nubel?rfsn=6624874.fe5acdf\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Check it out...\"],[8],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"span\"],[9,\"class\",\"closeBanner\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"highlightBanner\"],null],null],[7],[0,\"X\"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/highlight-bar.hbs" } });
});
define("fontdrop/templates/components/info-modal", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+zbMeZvM", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"data-reveal-id\",\"infoModal\"],[9,\"class\",\"infoModalLink\"],[7],[0,\"?\"],[8],[0,\"\\n\\n\\n\\t\"],[6,\"div\"],[9,\"id\",\"infoModal\"],[9,\"class\",\"reveal-modal\"],[9,\"data-reveal\",\"\"],[9,\"aria-labelledby\",\"modalTitle\"],[9,\"aria-hidden\",\"true\"],[9,\"role\",\"dialog\"],[7],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"fontdrop-logo\"],[7],[6,\"img\"],[9,\"src\",\"img/apple-touch-icon-512x512.png\"],[7],[8],[8],[0,\"\\n\\n\\t\\t\"],[6,\"h2\"],[9,\"id\",\"modalTitle\"],[7],[6,\"b\"],[7],[0,\"FontDrop!\"],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\"What’s Inside Your Font File?\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"lead\"],[7],[0,\"How many characters does this font include? Who designed it? \"],[6,\"br\"],[7],[8],[0,\"Which version is it? What about the copyright? \"],[6,\"br\"],[7],[8],[6,\"b\"],[7],[0,\"FontDrop!\"],[8],[0,\" reads and shows what’s in your font file.\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[6,\"b\"],[7],[0,\"Simply drag and drop\"],[8],[0,\" your OpenType or TrueType font files onto this website to see what’s inside them. Supported formats are OTF, TTF, WOFF and WOFF2 files.\\n\\t\\tThe result is generated in your browser, no server-side actions needed.\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"h3\"],[7],[0,\"Features\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Name, style, version and copyright information of the font, if available\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Shows all glyphs in the font file\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Shows details for every glyph\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Detect and show OpenType features*\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Detect and show ligatures\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Detect and show language support of font**\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Shows table data of the font file***\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Preview of the font with text and waterfall lines\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Type yourself – test and type with the font\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Supports variable fonts\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[0,\"\\n\\t\\tThere is a subpage of FontDrop! which you can use to \"],[6,\"b\"],[7],[0,\"compare two fonts with each other:\"],[8],[0,\" \"],[6,\"a\"],[9,\"href\",\"#/compare\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[9,\"title\",\"FontDrop Compare\"],[7],[0,\"#/compare\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[0,\"Find an \"],[6,\"a\"],[9,\"href\",\"https://viktornuebel.medium.com/fontdrop-whats-inside-your-font-file-c1c8d18f5061\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"article about FontDrop! on Medium\"],[8],[0,\" and check the \"],[6,\"a\"],[9,\"href\",\"https://viktornuebel.medium.com/fun-with-fonts-bdc1b5e5d4b9\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"Fun With Fonts\"],[8],[0,\" adventure.\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"h3\"],[7],[0,\"Behind the scenes\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[6,\"b\"],[7],[0,\"FontDrop!\"],[8],[0,\" is a easy-to-use web application. \\n\\t\\tIt parses font files with the help of \"],[6,\"a\"],[9,\"href\",\"http://opentype.js.org/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"opentype.js library\"],[8],[0,\". \\n\\t\\tFor variable fonts we use in addition \"],[6,\"a\"],[9,\"href\",\"https://github.com/Monotype/variableFont.js\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"variableFonts.js\"],[8],[0,\".\\n\\t\\tThe application itself is build with \"],[6,\"a\"],[9,\"href\",\"http://emberjs.com/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"Ember JS\"],[8],[0,\" and \"],[6,\"a\"],[9,\"href\",\"http://foundation.zurb.com/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[9,\"title\",\"Foundation framework\"],[7],[0,\"Foundation\"],[8],[0,\".\\n\\t\\tThe project is realized by \"],[6,\"a\"],[9,\"href\",\"https://viktornuebel.com/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"Viktor Nübel and Clemens Nübel\"],[8],[0,\".\\n\\t\\tUI-Font: \"],[6,\"a\"],[9,\"href\",\"https://www.myfonts.com/de/collections/ff-attribute-text-font-fontfont\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"FF Attribute\"],[8],[0,\". Current example font: \"],[6,\"a\"],[9,\"href\",\"https://viktornuebel.com/retail-fonts/rethink-sans-serif-typeface/\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"Rethink\"],[8],[0,\".\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[0,\"For any questions or comments about this site \"],[6,\"a\"],[9,\"href\",\"mailto:fontdrop@viktornuebel.com\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"get in touch!\"],[8],[8],[0,\"\\n\\n\\t\\t\"],[6,\"p\"],[7],[0,\"Like FontDrop? \"],[6,\"a\"],[9,\"href\",\"https://buymeacoffee.com/fontdrop\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Consider supporting the maintenance and development with a small donation!\"],[8],[8],[0,\"\\n\\t\\t\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"footnote\"],[7],[0,\"\\n\\t\\t\\t* FontDrop! detects all features in a font file, also unknown or custom features. Every feature gets an on/off-switch, even if it sometimes will have no visible effect or is useless, e.g. for ‘Required’ features.\\n\\t\\t\\tFontDrop will show all Ligatures in a font file and trys to show all substitute letters. Some features (lookups) are too compelx to show, and sometimes there are substitutes of substitutes, which FontDrop also cannot show.\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"footnote\"],[7],[0,\"\\n\\t\\t\\t** FontDrop! compares all Unicode encoded characters in the font file with a own database of languages. For more information about the language detection and a more detailed language report go to \"],[6,\"a\"],[9,\"href\",\"https://www.fontdrop.info/#/languages\"],[9,\"title\",\"CharSet Checker\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"FontDrop! Language Report\"],[8],[0,\".\\n\\t\\t\"],[8],[0,\"\\n\\t\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"footnote\"],[7],[0,\"\\n\\t\\t\\t*** The following \"],[6,\"b\"],[7],[0,\"font tables\"],[8],[0,\" get parsed by \"],[6,\"em\"],[7],[0,\"opentype.js\"],[8],[0,\": \"],[6,\"b\"],[7],[0,\"name\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"head\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"hhea\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"maxp\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"os/2\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"post\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"cmap\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"fvar\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"meta\"],[8],[0,\", \"],[6,\"b\"],[7],[0,\"GSUB\"],[8],[0,\" and \"],[6,\"b\"],[7],[0,\"kern\"],[8],[0,\". \\n\\t\\t\\tIf you want to learn more about all tables that might be used in font files, \\n\\t\\t\\thave a look in the \"],[6,\"a\"],[9,\"href\",\"https://www.microsoft.com/typography/OTSPEC/otff.htm#otttables\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener nofollow\"],[7],[0,\"OpenType specs here\"],[8],[0,\".\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"a\"],[9,\"class\",\"close-reveal-modal\"],[9,\"aria-label\",\"Close\"],[7],[0,\"×\"],[8],[0,\"\\n\\n\\t\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/info-modal.hbs" } });
});
define("fontdrop/templates/components/languages-details", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+O/kvSL3", "block": "{\"symbols\":[\"language\",\"glyph\",\"language\",\"language\",\"glyph\",\"language\"],\"statements\":[[0,\"\\t\\t\\t\\n\\t\\t\"],[6,\"ul\"],[9,\"class\",\"tabs\"],[9,\"data-tab\",\"\"],[9,\"role\",\"tablist\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title active\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Languages', 'Detected']);\"],[7],[6,\"a\"],[9,\"href\",\"#detected\"],[7],[0,\"Detected\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Languages', 'Database']);\"],[7],[6,\"a\"],[9,\"href\",\"#database\"],[7],[0,\"Database\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"tab-title\"],[9,\"onclick\",\"_paq.push(['trackEvent', 'Languages', 'About']);\"],[7],[6,\"a\"],[9,\"href\",\"#about\"],[7],[0,\"About the Report\"],[8],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\n\"],[6,\"div\"],[9,\"id\",\"fontLanguages\"],[7],[0,\"\\t\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"tabs-content\"],[7],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"detected\"],[9,\"class\",\"content active\"],[7],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"p\"],[9,\"class\",\"ot-feature-head\"],[7],[0,\"Support for \"],[6,\"b\"],[7],[1,[20,[\"fontLanguages\",\"length\"]],false],[8],[0,\" languages detected \"],[6,\"br\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"fontLanguages\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"li\"],[9,\"class\",\"languageItem\"],[7],[6,\"a\"],[9,\"href\",\"#\"],[3,\"action\",[[19,0,[]],\"scrollTo\",[19,6,[\"name\"]]]],[7],[1,[19,6,[\"name\"]],false],[8],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"languagesList\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"fontLanguages\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[10,\"id\",[26,[[25,\"clean-spaces\",[[19,4,[\"name\"]]],null]]]],[7],[6,\"span\"],[9,\"class\",\"note\"],[7],[1,[19,4,[\"script\"]],false],[8],[0,\" \"],[6,\"b\"],[7],[1,[19,4,[\"name\"]],false],[8],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"characterItems languagesFontOne\"],[7],[0,\"\\n\"],[4,\"each\",[[19,4,[\"langindex\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"characterItem\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"span\"],[7],[1,[25,\"format-charcode\",[[19,5,[]]],null],false],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"database\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"p\"],[9,\"class\",\"ot-feature-head\"],[7],[0,\"We have \"],[6,\"b\"],[7],[1,[20,[\"languageData\",\"length\"]],false],[8],[0,\" languages in our database so far.\"],[6,\"br\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"languageData\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"li\"],[10,\"class\",[26,[\"languageItem \",[25,\"array-contains\",[[20,[\"fontLanguagesArray\"]],[19,3,[\"name\"]]],null]]]],[7],[6,\"a\"],[9,\"href\",\"#\"],[3,\"action\",[[19,0,[]],\"scrollToDatabase\",[19,3,[\"name\"]]]],[7],[1,[19,3,[\"name\"]],false],[8],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"languagesList\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"languageData\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[10,\"id\",[26,[\"database-\",[25,\"clean-spaces\",[[19,1,[\"name\"]]],null]]]],[7],[6,\"span\"],[9,\"class\",\"note\"],[7],[1,[19,1,[\"script\"]],false],[8],[0,\" \"],[6,\"b\"],[7],[1,[19,1,[\"name\"]],false],[8],[6,\"a\"],[10,\"href\",[26,[\"https://en.wikipedia.org/wiki/\",[19,1,[\"wikipedia\"]]]]],[10,\"title\",[26,[\"Wikipedia Link \",[19,1,[\"name\"]]]]],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\" ↗\"],[8],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"characterItems languagesFontOne\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"langindex\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[10,\"class\",[26,[\"characterItem \",[25,\"array-contains\",[[20,[\"fontUniIndex\"]],[19,2,[]]],null]]]],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"span\"],[7],[1,[25,\"format-charcode\",[[19,2,[]]],null],false],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"about\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 large-8 columns\"],[7],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"About the language report\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[0,\"So far the FontDrop! language database contains \"],[6,\"b\"],[7],[1,[20,[\"languageData\",\"length\"]],false],[0,\" languages\"],[8],[0,\" in \"],[6,\"b\"],[7],[0,\"24 scripts\"],[8],[0,\". FontDrop! compares all unicode encoded characters in the font file with this database.\\n\\t\\t\\t\\t\\tThe database is based on the \"],[6,\"a\"],[9,\"href\",\"http://cldr.unicode.org/\"],[9,\"title\",\"Common Locale Data Repository\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Common Locale Data Repository\"],[8],[0,\" (CLDR) by the Unicode Consortium. \\n\\t\\t\\t\\t\\tYou will notice the database has got a strong focus on Latin languages. If you miss a language or script just \"],[6,\"a\"],[9,\"href\",\"mailto:fontrop@viktornuebel.com\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"get in touch\"],[8],[0,\".\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[0,\"FontDrop! only looks for the required characters of a language, to really use a language it of course needs more characters, like punctuation characters or sometimes auxiliary characters. For a report including auxiliary characters and punctuation you can go to \"],[6,\"a\"],[9,\"href\",\"https://www.alphabet-type.com/tools/charset-checker/\"],[9,\"title\",\"CharSet Checker\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"CharSet Checker by Alphabet Type\"],[8],[0,\". \\n\\t\\t\\t\\t\\tIf you need a custom encoding you can go to \"],[6,\"a\"],[9,\"href\",\"https://www.alphabet-type.com/tools/charset-builder/\"],[9,\"title\",\"CharSet Builder\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"CharSet Builder by Alphabet Type\"],[8],[8],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[0,\"There is another great project, using a database with more than 640 languages, which you should check as well: \"],[6,\"a\"],[9,\"href\",\"https://hyperglot.rosettatype.com/\"],[9,\"title\",\"Hyperglot Language Detection Website\"],[9,\"target\",\"_blank\"],[9,\"rel\",\"noopener\"],[7],[0,\"Hyperglot by Rosettatype\"],[8],[8],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"b\"],[7],[0,\"Detected\"],[8],[0,\" shows a list of all deteced languages in the dropped font file, and all characters belonging to each language.\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[6,\"b\"],[7],[0,\"Database\"],[8],[0,\" shows a list of all languages in the FontDrop! language database. In this section we use your system’s standard sans-serif font to show\\n\\t\\t\\t\\t\\tthe characters. Once a font file was dropped all languages and characters in the file gets highlighted.\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\n\\t\\t\"],[8],[0,\"\\n\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/languages-details.hbs" } });
});
define("fontdrop/templates/components/ligature-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "aKOpgufj", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/ligature-item.hbs" } });
});
define("fontdrop/templates/components/scroll-to-top", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Gb99oqbI", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[6,\"div\"],[9,\"id\",\"scroll-to-top\"],[7],[0,\"\\n\\t\"],[6,\"span\"],[7],[6,\"a\"],[9,\"href\",\"#\"],[3,\"action\",[[19,0,[]],\"toTop\"]],[7],[0,\"Top\"],[8],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/scroll-to-top.hbs" } });
});
define("fontdrop/templates/components/scroll-to", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "M9CS+4Gi", "block": "{\"symbols\":[\"&default\"],\"statements\":[[4,\"if\",[[22,1]],null,{\"statements\":[[0,\"  \"],[11,1],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[1,[18,\"label\"],false],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/components/scroll-to.hbs" } });
});
define("fontdrop/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vV1YrRVf", "block": "{\"symbols\":[],\"statements\":[[4,\"font-drop\",null,[[\"id\",\"send\",\"font\"],[\"fontDrop\",[25,\"action\",[[19,0,[]],\"changeFont\"],null],[20,[\"font\"]]]],{\"statements\":[[0,\"\\n               \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n                 \\n                    \"],[6,\"div\"],[9,\"id\",\"font-name\"],[9,\"class\",\"fontNameArea\"],[7],[0,\"\\n\\n                        \"],[6,\"span\"],[7],[0,\"You see\"],[8],[0,\"\\n                        \\n\"],[4,\"if\",[[20,[\"font\",\"names\",\"preferredFamily\",\"en\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"font-name droppedFont\"],[7],[1,[20,[\"font\",\"names\",\"preferredFamily\",\"en\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                \"],[6,\"span\"],[9,\"class\",\"font-name droppedFont\"],[7],[1,[20,[\"font\",\"names\",\"fullName\",\"en\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                        \\n                    \"],[8],[0,\"\\n\\n\\n                \\t\"],[6,\"div\"],[9,\"id\",\"font-data\"],[9,\"class\",\"fontDataArea\"],[7],[0,\"\\n\\n\"],[4,\"font-data\",null,[[\"font\"],[[20,[\"font\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\"],[4,\"sticky-element\",null,null,{\"statements\":[[0,\"                            \\n\"],[4,\"font-otfeatures\",null,[[\"font\",\"otFeatures\"],[[20,[\"font\"]],[20,[\"otFeatures\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\"],[4,\"font-variable-font\",null,[[\"font\"],[[20,[\"font\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"                                \\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"font-languages\",null,[[\"font\",\"languageData\"],[[20,[\"font\"]],[20,[\"languageData\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n                \\t\"],[8],[0,\"\\n\\n\\n                    \"],[6,\"div\"],[9,\"id\",\"font-info\"],[9,\"class\",\"fontInfoArea\"],[7],[0,\"\\n\\n\"],[4,\"font-info\",null,[[\"font\",\"otFeatures\",\"waterfallTexts\"],[[20,[\"font\"]],[20,[\"otFeatures\"]],[20,[\"waterfallTexts\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n                    \"],[8],[0,\"\\n\\n\\n                \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/index.hbs" } });
});
define("fontdrop/templates/languages", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ICdkq8/v", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"row page-languages\"],[7],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 columns\"],[7],[0,\"\\n\\n\"],[4,\"compare-drop-one\",null,[[\"id\",\"send\",\"fontOne\"],[\"compareDropOne\",[25,\"action\",[[19,0,[]],\"changeFontOne\"],null],[20,[\"fontOne\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"small-12 columns\"],[7],[0,\"\\n\\n\\t\\t\\t\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"h2\"],[7],[0,\"Language Report\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\"],[4,\"languages-details\",null,[[\"fontOne\",\"languageData\"],[[20,[\"fontOne\"]],[20,[\"languageData\"]]]],{\"statements\":[],\"parameters\":[]},null],[0,\"\\n\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "fontdrop/templates/languages.hbs" } });
});


define('fontdrop/config/environment', [], function() {
  var prefix = 'fontdrop';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("fontdrop/app")["default"].create({"name":"fontdrop","version":"1.0.0+8f1244fe"});
}
//# sourceMappingURL=fontdrop.map
