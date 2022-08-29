//// Système
var debugMode = false, haxLevels = false;
var stage, loader;
var frames = 0;
var fpsOn = false, fpsText;
var paused = false;
var activity = 0;
var imgD = "images/";
var sndD = "sounds/";
// input
var keysPressed = [], mouseMode = true;
// texte
var text, lang = "fr";
const font = "18px unispace", fontCode = "18px Courier New", fontTitle = "30px unispace", fontLarge = "20px unispace";
// fonctions programmées
var delayFrames = [], delayFunction = [], delayArg = [];
//// Entités
var entities = [];
var player, player2, player2Mode = false;
var enemy, playerTarget;
var shots = [], hittableShots = [];
//// Autres
var editor;
// level
var gameBackground, gameForeground, gamePause, gameReset, gameQuit, gameGod;
var levelNum, godMode;
var postGame, itemsUsed;
const maxStarsGoal = function(level)
{
	return ("pcpc1i0p" + "piic3p3i").charAt(level - 1);
};
// bullets
var bs;
const noBulletRotation = [8, 10, 11];
var sheet;
const sheetWidth = 15, sheetHeight = 12;
const defImage = 1, defColor = 1, defSize = 100, defLife = 6000, defSpeed = 100, defNumber = 1, defRepeatDelay = 10, defTriggerDelay = 100, defGravityForce = 100, noneText = "*none*", noIdText = "*no id*";
var comboTitle, comboValue, comboLong, comboHitFrame, combo100done, combo;
// menu
var startButton;
var selectedTab, tab1Button, tab2Button, tab3Button;
var levelButtons = [], editorButtons = [], optionButtons = [];
var normalLevelsText, hardLevelsText, bracket1, bracket2, bracket3, bracket4, errorText, codeField;
var stars = [];
var levelPreview;
// stats
var lastHitShot, hitFrames = [], levelFrames, killedBullets;

function init()
{
	entities = [];
	text = new Text();
	canvas = document.getElementById("game");
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver();

	gameBackground = new createjs.Shape();
	gameBackground.graphics.beginFill("#134").drawRect(0, 0, canvas.width, canvas.height);

	loadProgressLabel = new createjs.Text("", font, "#697");
	loadProgressLabel.lineWidth = 200;
	loadProgressLabel.x = canvas.width / 2;
	loadProgressLabel.y = canvas.height - 120;
	loadProgressLabel.textAlign = "center";

	loadingBarContainer = new createjs.Container();
	loadingBarHeight = 20;
	loadingBarWidth = 200;
	loadingBarColor = "#697";

	loadingBar = new createjs.Shape();
	loadingBar.graphics.beginFill(loadingBarColor).drawRect(0, 0, 1, loadingBarHeight).endFill();

	frame = new createjs.Shape();
	padding = 3;
	frame.graphics.setStrokeStyle(1).beginStroke(loadingBarColor).drawRect(-padding / 2,
																		   -padding / 2,
																		   loadingBarWidth + padding,
																		   loadingBarHeight + padding);

	loadingBarContainer.addChild(loadingBar, frame);
	loadingBarContainer.x = canvas.width / 2 - 100;
	loadingBarContainer.y = canvas.height - 90;

	var loadList = [{id: "chacs", src: "chacs.png"},
					{id: "menu pause", src: "menu pause.png"},
					{id: "menu reset", src: "menu reset.png"},
					{id: "menu quit", src: "menu quit.png"},
					{id: "menu next", src: "menu next.png"},
					{id: "menu godmode", src: "menu godmode.png"},
					{id: "player", src: "player.png"},
					{id: "player 2", src: "player 2.png"},
					{id: "player shot", src: "player shot.png"},
					{id: "jetpack", src: "jetpack.png"},
					{id: "enemy", src: "enemy.png"},
					{id: "enemy lv1", src: "enemy lv1.png"},
					{id: "enemy lv2", src: "enemy lv2.png"},
					{id: "enemy lv3", src: "enemy lv3.png"},
					{id: "enemy lv4", src: "enemy lv4.png"},
					{id: "enemy lv5", src: "enemy lv5.png"},
					{id: "enemy lv6", src: "enemy lv6.png"},
					{id: "enemy lv7", src: "enemy lv7.png"},
					{id: "enemy lv8", src: "enemy lv7.png"},
					{id: "enemy arm lv1", src: "enemy arm lv1.png"},
					{id: "enemy arm lv2", src: "enemy arm lv1.png"},
					{id: "enemy arm lv3", src: "empty.png"},
					{id: "enemy arm lv4", src: "empty.png"},
					{id: "enemy arm lv5", src: "enemy arm lv5.png"},
					{id: "enemy arm lv6", src: "enemy arm lv6.png"},
					{id: "enemy arm lv7", src: "empty.png"},
					{id: "enemy arm lv8", src: "empty.png"},
					{id: "enemy head lv1", src: "empty.png"},
					{id: "enemy head lv2", src: "empty.png"},
					{id: "enemy head lv3", src: "enemy head lv3.png"},
					{id: "enemy head lv4", src: "enemy head lv3.png"},
					{id: "enemy head lv5", src: "enemy head lv5.png"},
					{id: "enemy head lv6", src: "enemy head lv6.png"},
					{id: "enemy head lv7", src: "enemy head lv7.png"},
					{id: "enemy head lv8", src: "enemy head lv7.png"},
					{id: "enemy preview lv1", src: "enemy preview lv1.png"},
					{id: "enemy preview lv2", src: "enemy preview lv2.png"},
					{id: "enemy preview lv3", src: "enemy preview lv3.png"},
					{id: "enemy preview lv4", src: "enemy preview lv4.png"},
					{id: "enemy preview lv5", src: "enemy preview lv5.png"},
					{id: "enemy preview lv6", src: "enemy preview lv6.png"},
					{id: "enemy preview lv7", src: "enemy preview lv7.png"},
					{id: "enemy preview lv8", src: "enemy preview lv7.png"},
					{id: "enemy 2", src: "enemy 2.png"},
					{id: "flash", src: "flash.png"},
					{id: "arrow", src: "arrow.png"},
					{id: "shot sheet", src: "shot sheet.png"},
					{id: "bomb", src: "bomb2.png"},
					{id: "bullets", src: "dead bullets.png"},
					{id: "star 1", src: "star 1.png"},
					{id: "star 2", src: "star 2.png"},
					{id: "target", src: "target.png"},
					{id: "cat main", src: "category main.png"},
					{id: "cat appearance", src: "category appearance.png"},
					{id: "cat movement", src: "category movement.png"},
					{id: "cat position", src: "category position.png"},
					{id: "cat amount", src: "category amount.png"},
					{id: "cat sequence", src: "category sequence.png"},
					{id: "cat sound", src: "sound.png"},
					{id: "background menu", src: "background menu.png"},
					{id: "background game", src: "background game.png"},
					{id: "background game 2", src: "background game 2.png"},
					{id: "background game 3", src: "background game 3.png"},
					{id: "background game lv1", src: "background game lv1.png"},
					{id: "background game lv2", src: "background game lv1.png"},
					{id: "background game lv3", src: "background game lv3.png"},
					{id: "background game lv4", src: "background game lv3.png"},
					{id: "background game lv5", src: "background game lv5.png"},
					{id: "background game lv6", src: "background game lv5.png"},
					{id: "background game lv7", src: "background game lv7.png"},
					{id: "background game lv8", src: "background game lv7.png"}];

	loadList.forEach(element => element.src = imgD + element.src);

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("progress", handleProgress);
	loader.loadManifest(loadList);

	createjs.Sound.registerSound(sndD + "button.ogg", "button");
	createjs.Sound.registerSound(sndD + "hit.ogg", "hit");
	createjs.Sound.registerSound(sndD + "hit 2.ogg", "hit2", 3);
	createjs.Sound.registerSound(sndD + "win.ogg", "win");
	createjs.Sound.registerSound(sndD + "fail.ogg", "fail");
	createjs.Sound.registerSound(sndD + "bomb.ogg", "bomb");
	createjs.Sound.registerSound(sndD + "combobreak.ogg", "combobreak");
	createjs.Sound.registerSound(sndD + "shot player.ogg", "shot player", 3);
	createjs.Sound.registerSound(sndD + "shot slowbullet.ogg", "shot1", 3);
	createjs.Sound.registerSound(sndD + "shot mediumbullet.ogg", "shot2", 3);
	createjs.Sound.registerSound(sndD + "shot fastbullet.ogg", "shot3", 5);
	createjs.Sound.registerSound(sndD + "shot explosion.ogg", "shot4", 3);
	createjs.Sound.registerSound(sndD + "shot laserbeam.ogg", "shot5", 8);
	createjs.Sound.registerSound(sndD + "shot laserbullet.ogg", "shot6", 3);
	createjs.Sound.registerSound(sndD + "shot launcher.ogg", "shot7", 3);
	createjs.Sound.registerSound(sndD + "shot drop.ogg", "shot8", 3);
	createjs.Sound.registerSound(sndD + "shot missile.ogg", "shot9", 3);
	createjs.Sound.registerSound(sndD + "shot shock.ogg", "shot10", 3);
	createjs.Sound.registerSound(sndD + "shot fire.ogg", "shot11", 3);
	createjs.Sound.registerSound(sndD + "shot magic.ogg", "shot12", 5);
	createjs.Sound.registerSound(sndD + "shot sonicwave.ogg", "shot13", 3);
	createjs.Sound.volume = 0.7;

	stage.addChild(gameBackground, loadProgressLabel, loadingBarContainer);
	stage.update();
}

function handleProgress()
{
	loadingBar.scaleX = loader.progress * loadingBarWidth;
	progresPrecentage = Math.round(loader.progress * 100);
	loadProgressLabel.text = progresPrecentage + "%";

	stage.update();
}

function handleComplete()
{
	start();
	stage.removeChild(loadProgressLabel, loadingBarContainer);

	stage.update();
}

function start()
{
	activity = 1;
	sheet = new createjs.SpriteSheet({images: [imgD + "shot sheet.png"], frames: {width: 100, height: 100, spacing: 1}});

	var menuBackground = new createjs.Bitmap(loader.getResult("background menu"));

	menuBackground.name = "menu background";
	menuBackground.x = 0;
	menuBackground.y = 0;

	gameBackground = new createjs.Bitmap(loader.getResult("background game"));
	gameBackground.name = "game background";
	gameBackground.x = 0;
	gameBackground.y = 0;

	var titleText = new createjs.Text("Bullet Hell Maker", fontTitle, "#fff");
	var bracketsColor = "#465";

	titleText.name = "text titletext";
	titleText.textAlign = "center";
	titleText.x = canvas.width / 2;
	titleText.y = 140;
	titleText.shadow = new createjs.Shadow("#555", -3, 3, 0);

	normalLevelsText = new createjs.Text(text.get("m_l_nl"), font, bracketsColor);
	normalLevelsText.name = "text normallevels";
	normalLevelsText.x = 515;
	normalLevelsText.y = 318;
	normalLevelsText.textAlign = "right";
	normalLevelsText.visible = false;

	hardLevelsText = new createjs.Text(text.get("m_l_hl"), font, bracketsColor);
	hardLevelsText.name = "text hardlevels";
	hardLevelsText.x = 515;
	hardLevelsText.y = 394;
	hardLevelsText.textAlign = "right";
	hardLevelsText.visible = false;

	errorText = new createjs.Text("", fontCode, "#fff");
	errorText.name = "text errortext";
	errorText.x = 70;
	errorText.y = 440;
	errorText.scaleX = 0.8;

	bracket1 = new createjs.Shape();
	bracket1.graphics.setStrokeStyle(3).beginStroke(bracketsColor).drawRoundRect(510, 272, 20, 72, 2);
	bracket1.cache(520, 262, 20, 92);
	bracket1.visible = false;

	bracket2 = new createjs.Shape();
	bracket2.graphics.setStrokeStyle(3).beginStroke(bracketsColor).drawRoundRect(510, 348, 20, 72, 2);
	bracket2.cache(520, 338, 20, 92);
	bracket2.visible = false;

	bracket3 = new createjs.Shape();
	bracket3.graphics.setStrokeStyle(3).beginStroke(bracketsColor).drawRoundRect(70, 272, 20, 72, 2);
	bracket3.cache(60, 262, 20, 92);
	bracket3.visible = false;

	bracket4 = new createjs.Shape();
	bracket4.graphics.setStrokeStyle(3).beginStroke(bracketsColor).drawRoundRect(70, 348, 20, 72, 2);
	bracket4.cache(60, 338, 20, 92);
	bracket4.visible = false;

	var chacs = new createjs.Bitmap(loader.getResult("chacs"));

	chacs.name = "menu chacs";
	chacs.x = 10;
	chacs.y = canvas.height - 64;
	chacs.scaleX = 0.5;
	chacs.scaleY = 0.5;
	chacs.alpha = 0.8;

	var credits = new createjs.Text(text.get("m_cre"), font, "#bbb");

	credits.name = "text credits";
	credits.x = 80;
	credits.y = canvas.height - 24;

	stage.addChild(menuBackground, titleText, normalLevelsText, hardLevelsText, errorText, chacs, credits, bracket1, bracket2, bracket3, bracket4);

	codeField = document.createElement("input");
	codeField.id = "code_input";
	codeField.type = "text";
	codeField.value = text.get("m_e_ent");
	codeField.style.display = "none";
	codeField.style.position = "absolute";
	codeField.style.left = (canvas.offsetLeft + 70) + "px";
	codeField.style.top = (canvas.offsetTop + 410) + "px";
	codeField.style.width = (canvas.width - 230) + "px";
	codeField.style.color = "rgb(176, 176, 176)";
	codeField.style.backgroundColor = "rgb(16, 48, 64)";
	codeField.style.font = fontCode;
	codeField.addEventListener("focus", function(event)
	{
		if (codeField.style.color == "rgb(176, 176, 176)")
		{
			codeField.style.color = "rgb(192, 240, 208)";
			codeField.value = "";
		}
	}, true);

	document.body.appendChild(codeField);

	// boutons
	startButton = new Button(text.get("m_st"), canvas.width / 2, 325, 200, "#ade");
	startButton.label.on("click", function(event)
	{
		selectedTab = new createjs.Shape();
		selectedTab.name = "menu selectedtab";
		selectedTab.x = 87;
		selectedTab.y = 211;

		if (!/MSIE|Trident/.test(window.navigator.userAgent))
			selectedTab.graphics.beginFill("#fff2").drawRoundRect(0, 0, 127, 25, 5);
		else
			selectedTab.graphics.beginFill("#fff").drawRoundRect(0, 0, 127, 25, 5);

		stage.addChild(selectedTab);

		tab1Button = new Button(text.get("m_t_lvl"), 150, 215, 125, "#cfe");
		tab1Button.label.on("click", function(event)
		{
			if (activity == 1 && levelPreview == undefined)
			{
				if (levelButtons.length > 0)
					clearMenu();

				selectedTab.x = 87;
				normalLevelsText.visible = true;
				hardLevelsText.visible = true;
				bracket1.visible = true;
				bracket2.visible = true;
				bracket3.visible = true;
				bracket4.visible = true;

				levelButtons = [];

				var x = 100;
				var y = 280;
				var l = 1;

				for (var c = 0; c < codes.length; c++)
				{
					var locked = !haxLevels && c != 0 && getCookie("stars_lvl_" + c) == "";
					var level = new Button(l, x, y, 36, locked ? "#999" : "#cfe");
					var starsMax = locked ? 0 : 3;
					var starsEarned = getCookie("stars_lvl_" + (c + 1));

					level.label.locked = locked;
					level.label.number = c;
					level.label.stars = starsEarned;
					level.label.on("click", function(event)
					{
						if (activity == 1 && levelPreview == undefined)
						{
							if (event.target.locked)
								createjs.Sound.play("shot2");
							else
								levelPreview = new LevelPreview(event.target.number, event.target.stars);
						}
					});

					levelButtons.push(level);

					for (var s = 0; s < starsMax; s++)
					{
						star = new createjs.Bitmap(loader.getResult("star" + (starsEarned > s ? " 1" : " 2")));
						star.name = "menu star";
						star.x = x - 15 + s * 10;
						star.y = y + 15;
						star.scaleX = 0.35;
						star.scaleY = 0.35;

						stage.addChild(star);
						stars.push(star);
					}

					x += 44;
					l++;
					if (x > 530 || c == codes.length / 2 - 1)
					{
						x = 100;
						y += 76;
						if (c == codes.length / 2 - 1)
							l = 1;
					}

					levelButtons.push(level);
				}
			}
		});
		tab1Button.forceClick();

		tab2Button = new Button(text.get("m_t_edt"), 300, 215, 125, "#ade");
		tab2Button.label.on("click", function(event)
		{
			if (activity == 1 && levelPreview == undefined)
			{
				clearMenu();

				selectedTab.x = 237;
				editorButtons = [];

				errorText.text = "";
				codeField.blur();

				button = new Button(text.get("m_e_new"), canvas.width / 2, 300, 200, "#ade");
				button.label.on("click", function(event)
				{
					if (activity == 1)
						openEditor();
				});
				editorButtons.push(button);

				button = new Button(text.get("m_e_gen"), canvas.width / 2, 325, 200, "#999");
				button.label.on("click", function(event)
				{
					if (activity == 1)
						createjs.Sound.play("shot2");
				});
				editorButtons.push(button);

				button = new Button(text.get("m_e_sha"), canvas.width / 2, 350, 200, "#999");
				button.label.on("click", function(event)
				{
					if (activity == 1)
						createjs.Sound.play("shot2");
				});
				editorButtons.push(button);

				button = new Button(text.get("m_e_pl"), canvas.width - 110, 415, 80, "#ade");
				button.label.on("click", function(event)
				{
					errorText.text = "";

					if (activity == 1 && codeField.style.color == "rgb(192, 240, 208)")
					{
						levelNum = -1;
						readCode();
					}
				});
				editorButtons.push(button);
		
				codeField.style.display = "block";
			}
		});

		tab3Button = new Button(text.get("m_t_opt"), 450, 215, 125, "#8be");
		tab3Button.label.on("click", function(event)
		{
			if (activity == 1 && levelPreview == undefined)
			{
				clearMenu();

				selectedTab.x = 387;
				optionButtons = [];
				errorText.text = "";

				button = new Button(createjs.Sound.muted ? text.get("m_o_sn0") : text.get("m_o_sn1"), canvas.width / 2, 300, 200, "#8be");
				button.label.on("click", function(event)
				{
					if (activity == 1)
					{
						var x = event.target.x + event.target.getMeasuredWidth() / 2;

						createjs.Sound.muted = !createjs.Sound.muted;
						event.target.text = createjs.Sound.muted ? text.get("m_o_sn0") : text.get("m_o_sn1");
						event.target.x = x - event.target.getMeasuredWidth() / 2;
					}
				});
				optionButtons.push(button);

				button = new Button(mouseMode ? text.get("m_o_mos") : text.get("m_o_mok"), canvas.width / 2, 325, 200, "#8be");
				button.label.on("click", function(event)
				{
					if (activity == 1)
					{
						var x = event.target.x + event.target.getMeasuredWidth() / 2;

						mouseMode = !mouseMode;
						event.target.text = mouseMode ? text.get("m_o_mos") : text.get("m_o_mok");
						event.target.x = x - event.target.getMeasuredWidth() / 2;
					}
				});
				optionButtons.push(button);

				button = new Button(fpsOn ? text.get("m_o_fp1") : text.get("m_o_fp0"), canvas.width / 2, 350, 200, "#8be");
				button.label.on("click", function(event)
				{
					if (activity == 1)
					{
						var x = event.target.x + event.target.getMeasuredWidth() / 2;

						fpsOn = !fpsOn;
						event.target.text = fpsOn ? text.get("m_o_fp1") : text.get("m_o_fp0");
						event.target.x = x - event.target.getMeasuredWidth() / 2;
					}
				});
				optionButtons.push(button);

				button = new Button(player2Mode ? text.get("m_o_pl2") : text.get("m_o_pl1"), canvas.width / 2, 375, 200, "#8be");
				button.label.on("click", function(event)
				{
					if (activity == 1)
					{
						var x = event.target.x + event.target.getMeasuredWidth() / 2;

						player2Mode = !player2Mode;
						event.target.text = player2Mode ? text.get("m_o_pl2") : text.get("m_o_pl1");
						event.target.x = x - event.target.getMeasuredWidth() / 2;
					}
				});
				optionButtons.push(button);

				button = new Button(text.get("m_o_lan"), canvas.width / 2, 400, 200, "#8be");
				button.label.on("click", function(event)
				{
					if (activity == 1)
					{
						lang = lang == "fr" ? "en" : "fr";

						tab1Button.updateText(text.get("m_t_lvl"));
						tab2Button.updateText(text.get("m_t_edt"));
						tab3Button.updateText(text.get("m_t_opt"));

						normalLevelsText.text = text.get("m_l_nl");
						hardLevelsText.text = text.get("m_l_hl");
						credits.text = text.get("m_cre");

						optionButtons[0].updateText(createjs.Sound.muted ? text.get("m_o_sn0") : text.get("m_o_sn1"));
						optionButtons[1].updateText(mouseMode ? text.get("m_o_mos") : text.get("m_o_mok"))
						optionButtons[2].updateText(fpsOn ? text.get("m_o_fp1") : text.get("m_o_fp0"));
						optionButtons[3].updateText(player2Mode ? text.get("m_o_pl2") : text.get("m_o_pl1"));
						optionButtons[4].updateText(text.get("m_o_lan"));
					}
				});
				optionButtons.push(button);
			}
		});

		startButton.kill();
	});

	// updates
	createjs.Ticker.on("tick", tick);
	createjs.Ticker.framerate = 100;

	// input
	this.document.onkeydown = function(event)
	{
		if (keysPressed.indexOf(event.keyCode) == -1)
			keysPressed.push(event.keyCode);

		// anti-scroll
		if ([32, 37, 38, 39, 40, 65, 68, 83, 87].indexOf(event.keyCode) > -1 && document.activeElement.type == undefined && activity != 0)
			event.preventDefault();
	};

	this.document.onkeyup = function(event)
	{
		keysPressed.splice(keysPressed.indexOf(event.keyCode), 1);

		// Esc: retour menu
		if (event.keyCode == 27 && stage.contains(gameBackground))
			stop();
		// Espace: retour menu
		if (event.keyCode == 32 && stage.contains(gameBackground))
			pause();
		// B: bombe
		if (event.keyCode == 66 && player != undefined)
			player.useBomb(false);

		if (debugMode)
		{
			// E: liste des children
			if (event.keyCode == 69)
			{
				console.log("-- Entities --");
				for (var e = 0; e < entities.length; e++)
					console.log(e + ": " + entities[e].toString());

				console.log("-- Children --");
				for (var c = 0; c < stage.children.length; c++)
					console.log(c + ": " + stage.children[c]);
			}
			// F: debug
			if (event.keyCode == 70)
			{
				// fps
				console.log("FPS: " + Math.floor(createjs.Ticker.getMeasuredFPS()));
				// frame
				console.log("Frame: " + frames);
				// nombre d'entités / nombre de stage.children
				console.log("Entity: " + entities.length + " / Child: " + stage.numChildren);
				// curseur x et y
				console.log("MouseX: " + stage.mouseX + " - MouseY: " + stage.mouseY);
			}
			// H: autres
			if (event.keyCode == 72)
			{
				console.log(1 + Math.floor(stage.mouseX / 50));
				createjs.Sound.play("shot" + (1 + Math.floor(stage.mouseX / 50)));
				enemy.hp = 7;
			}
		}
		// R: reset
		if (event.keyCode == 82 && stage.contains(gameBackground))
			reset();
	};

	this.document.onclick = function(event)
	{
		if (player != undefined)
			player.useBomb(true);
	};
}

function tick(event)
{
	if (!paused)
		frames++;

	// update entités
	for (i = 0; i < entities.length; i++)
		if (!entities[i].remove)
			entities[i].ontick();

	for (i = 0; i < entities.length; i++)
		if (entities[i].remove)
			entities.splice(i, 1);

	// lancement de fonction programmée
	if (!paused)
		for (var i = 0; i < delayFunction.length; i++)
			if (delayFrames[i] > 0 && --delayFrames[i] == 0)
				delayFunction[i](delayArg[i]);

	// gameForeground quand combat fini
	if (/MSIE|Trident/.test(window.navigator.userAgent))
		stage.removeChild(gameForeground);

	if (stage.contains(gameForeground))
		gameForeground.alpha += 0.01;

	// FPS
	if (fpsOn && activity == 2 && frames % 10 == 0)
		fpsText.text = "FPS: " + Math.floor(createjs.Ticker.getMeasuredFPS());

	// combos
	if (comboHitFrame < frames - 150)
	{
		comboTitle.text = "";
		comboValue.text = "";
	}

	stage.update(event);
}

function readCode()
{
	if (codeField.value != "")
		play(codeField.value);
}

function clearMenu()
{
	if (activity == 1)
	{
		for (var b = 0; b < levelButtons.length; b++)
			levelButtons[b].kill();
		for (var b = 0; b < editorButtons.length; b++)
			editorButtons[b].kill();
		for (var b = 0; b < optionButtons.length; b++)
			optionButtons[b].kill();

		normalLevelsText.visible = false;
		hardLevelsText.visible = false;
		bracket1.visible = false;
		bracket2.visible = false;
		bracket3.visible = false;
		bracket4.visible = false;
		errorText.text = "";
		codeField.value = text.get("m_e_ent");
		codeField.style.color = "rgb(176, 176, 176)";
		codeField.style.display = "none";

		for (var s = 0; s < stars.length; s++)
			stage.removeChild(stars[s]);

		stars = [];
	}
	if (activity == 3)
	{
		for (var f = 0; f < editor.fields.length; f++)
			document.getElementById(editor.fields[f]).style.display = "none";
	}
}

function play(inpt)
{
	try
	{
		var code = JSON.parse(inpt);

		checkJSON(code);

		bs = new BulletSystem(code);
		bs.raw = inpt;

		codeField.style.display = "block";
		codeField.focus();
		codeField.style.display = "none";
		clearMenu();

		var backgroundNum = "";

		if (levelNum > 0)
			backgroundNum += " lv" + (levelNum > codes.length / 2 ? levelNum - codes.length / 2 : levelNum);

		gameBackground = new createjs.Bitmap(loader.getResult("background game" + backgroundNum));
		gameBackground.name = "game background";
		gameBackground.x = 0;
		gameBackground.y = 0;

		stage.addChild(gameBackground);
		activity = 2;
		lastHitShot = undefined;
		levelFrames = frames;
		killedBullets = 0;
		hitFrames = [];
		itemsUsed = 0;

		enemy = new Enemy();
		player = new Player();

		if (player2Mode)
			player2 = new Player(2);

		pickTarget();

		combo100done = false;

		comboTitle = new createjs.Text("", font, "#fff");
		comboTitle.name = "text combotitle";
		comboTitle.textAlign = "center";
		comboTitle.x = canvas.width / 2;
		comboTitle.y = 20;

		comboValue = new createjs.Text("", fontTitle, "#ff0");
		comboValue.name = "text combovalue";
		comboValue.textAlign = "center";
		comboValue.x = canvas.width / 2;
		comboValue.y = 35;

		comboValueLong = new createjs.Text("", fontTitle, "#ff0");
		comboValueLong.name = "text combovaluelong";
		comboValueLong.textAlign = "center";
		comboValueLong.x = canvas.width / 2;
		comboValueLong.y = 35;

		stage.addChild(comboTitle, comboValue, comboValueLong);
		//canPerfectCombo = code.options != undefined && code.options.indexOf("perfect_combo") > -1;

		if (!isNaN(maxStarsGoal(levelNum)))
		{
			deadBullets = new createjs.Bitmap(loader.getResult("bullets"));
			deadBullets.name = "deadbullets";
			deadBullets.x = 5;
			deadBullets.y = 5;
			deadBullets.alpha = 0;

			killedBulletsText = new createjs.Text("0", font, "#fff");
			killedBulletsText.name = "text killedbullets";
			killedBulletsText.textAlign = "center";
			killedBulletsText.x = 39;
			killedBulletsText.y = 10;
			killedBulletsText.alpha = 0;

			stage.addChild(deadBullets, killedBulletsText);
		}

		gamePause = new Button("menu pause", canvas.width - 111, canvas.height - 37);
		gamePause.image.on("click", function(event)
		{
			pause();
		});

		gameReset = new Button("menu reset", canvas.width - 74, canvas.height - 37);
		gameReset.image.on("click", function(event)
		{
			reset();
		});

		gameQuit = new Button("menu quit", canvas.width - 37, canvas.height - 37);
		gameQuit.image.on("click", function(event)
		{
			stop();
		});

		if (fpsOn)
		{
			fpsText = new createjs.Text("", font, "#fff");

			fpsText.name = "text fpstext";
			fpsText.x = 65;
			fpsText.y = canvas.height - 20;

			stage.addChild(fpsText);
		}

		if (haxLevels || getCookie("stars_lvl_" + codes.length) > 0)
		{
			gameGod = new Button("menu godmode", canvas.width - 148, canvas.height - 37);
			gameGod.image.on("click", function(event)
			{
				godMode = !godMode;

				stage.removeChild(player.hpBarF);

				player.hpBarF = new createjs.Shape();
				player.hpBarF.name = "player hpbar f";
				player.hpBarF.graphics.beginFill(godMode ? "#fd9" : (player.noHit > 0 ? "#cff" : "#0ff")).drawRect((canvas.width - enemy.width) / 2, canvas.height - (player2Mode && !this.player2 ? 37 : 17), enemy.width * player.hp / player.maxHp, 12);

				stage.addChildAt(player.hpBarF, stage.getChildIndex(player.image));

				if (player2Mode)
				{
					stage.removeChild(player2.hpBarF);

					player2.hpBarF = new createjs.Shape();
					player2.hpBarF.name = "player hpbar f";
					player2.hpBarF.graphics.beginFill(godMode ? "#fd9" : (player2.noHit > 0 ? "#cfd" : "#0f9")).drawRect((canvas.width - enemy.width) / 2, canvas.height - 17, enemy.width * player2.hp / player2.maxHp, 12);

					stage.addChildAt(player2.hpBarF, stage.getChildIndex(player.image));
				}
			});
		}
	}
	catch (e)
	{
		if (debugMode)
			console.log(e);

		errorText.text = e;
	}
}

function pause()
{
	if (player.hp > 0 && (!player2Mode || player2.hp > 0) && enemy.hp > 0)
	{
		paused = !paused;

		if (paused)
		{
			gameForeground = new createjs.Shape();
			gameForeground.name = "pause foreground";
			gameForeground.graphics.beginFill("#aaa6").drawRect(0, 0, canvas.width, canvas.height);

			stage.addChildAt(gameForeground, stage.getChildIndex(gamePause.image) - 1);
		}
		else
			stage.removeChild(gameForeground);
	}
}

function reset()
{
	stop();
	play(bs.raw);
}

function stop()
{
	stage.removeChild(gameBackground, gameForeground);
	gameForeground = undefined;

	while (shots.length > 0)
		shots[0].kill();

	player.kill();
	enemy.kill();
	playerTarget = undefined;

	if (player2Mode)
		player2.kill();

	gamePause.kill();
	gameReset.kill();
	gameQuit.kill();

	if (gameGod != undefined)
		gameGod.kill();

	delayFrames = [];
	delayFunction = [];
	delayArg = [];

	if (editor == undefined)
	{
		activity = 1;

		if (selectedTab.x == 87)
			tab1Button.forceClick();
		else
			tab2Button.forceClick();
	}
	else
	{
		activity = 3;
		editor.attacksList.style.display = "block";

		var fieldsList = ["", editor.page1fields, editor.page2fields, editor.page3fields, editor.page4fields][editor.tab];

		for (var f = 0; f < fieldsList.length; f++)
			fieldsList[f].style.display = "block";
	}
	if (postGame != undefined)
		postGame.kill();

	paused = false;

	stage.removeChild(comboTitle, comboValue, comboValueLong, fpsText);
	if (!isNaN(maxStarsGoal(levelNum)))
		stage.removeChild(deadBullets, killedBulletsText);
}

function openEditor()
{
	editMode = false;
	errorText.text = "";
	codeField.value = text.get("m_e_ent");
	codeField.style.color = "rgb(176, 176, 176)";
	codeField.style.display = "none";

	levelNum = -1;
	activity = 3;
	new Editor();
}

function pickTarget()
{
	var oldPlayer = playerTarget;

	playerTarget = player2Mode && Math.random() > 0.5 ? player2 : player;

	if ((oldPlayer != undefined || player2Mode) && playerTarget != oldPlayer)
	{
		playerTarget.target.visible = true;

		schedule(80, function()
		{
			playerTarget.target.visible = false;
		});
	}

	schedule(Math.floor(Math.random() * 400 + 300), function()
	{
		pickTarget();
	});
}

function getImageIndex(id)
{
	return Math.floor(id / 100) * sheetWidth + id % 100 - 1;
}

function getImageId(image, color)
{
	return parseInt(image) + (parseInt(color - 1)) * 100;
}

function schedule(delay, funct, arg)
{
	delayFrames.push(delay);
	delayFunction.push(funct);
	delayArg.push(arg);
}

function distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}

function direction(x1, y1, x2, y2)
{
	var res = Math.atan((y2 - y1) / (x2 - x1)) / (Math.PI / -180);

	if (isNaN(res))
		res = 0;

	if (x1 > x2)
		res += 180;

	return res;
}

function copyMap(map)
{
	var ret = {};

	for (var i in map)
		ret[i] = map[i];

	return ret;
}

function checkJSON(code)
{
	if (code.attacks == undefined)
		throw new Error("Missing enement 'attacks'");
	if (code.attacks.length == 0)
		throw new Error("'attacks' is empty");

	for (var a = 0; a < code.attacks.length; a++)
	{
		if (code.attacks[a].id != undefined && code.attacks[a].id.length > 30)
			code.attacks[a].id = code.attacks[a].id.substring(0, 30);
		if (code.attacks[a].next_id != undefined && code.attacks[a].next_id.length > 30)
			code.attacks[a].next_id = code.attacks[a].next_id.substring(0, 30);
	}
}

function setCookie(cname, cvalue)
{
	var d = new Date();

	d.setTime(d.getTime() + 315360000000);
	document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');

	for (var i = 0; i < ca.length; i++)
	{
		var c = ca[i];

		while (c.charAt(0) == ' ')
			c = c.substring(1);

		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}