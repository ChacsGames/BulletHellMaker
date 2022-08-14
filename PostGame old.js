function PostGame(win)
{
	postGame = this;

	const canNextLevel = win && levelNum > -1;
	const canPerfect = !player2Mode && (levelNum == -1 || canPerfectCombo(levelNum));
	const flawless = player.hp == player.maxHp && (!player2Mode || player2.hp == player2.maxHp);
	const perfect = comboValue.text == enemy.maxHp;

	this.x = 150;
	this.y = 300;
	this.width = canvas.width - this.x * 2;
	this.height = 200;

	this.shape = new createjs.Shape();
	this.shape.name = "postgame background";
	this.shape.graphics.setStrokeStyle(3).beginStroke("#9ab").beginFill("#678").drawRect(this.x, this.y, this.width, this.height);

	this.fail = new createjs.Text(text.get("pg_fail"), font, "#e94");
	this.fail.name = "postgame fail";
	this.fail.x = canvas.width / 2;
	this.fail.y = this.y + 20;
	this.fail.textAlign = "center";

	this.tip = new createjs.Text(this.getTip(), font, "#fff");
	this.tip.name = "postgame fail";
	this.tip.x = this.x + 115;
	this.tip.x = canvas.width / 2;
	this.tip.y = this.y + 45;
	this.tip.textAlign = "center";
	this.tip.lineHeight = 17;

	this.win1 = new createjs.Text(text.get("pg_win"), font, "#fff");
	this.win1.name = "postgame win1";
	this.win1.x = this.x + 115;
	this.win1.y = this.y + 20;

	this.win2 = new createjs.Text(text.get("pg_flw"), font, flawless ? "#fff" : "#000");
	this.win2.name = "postgame win2";
	this.win2.x = this.x + 115;
	this.win2.y = this.y + 55;

	if (canPerfect)
	{
		this.win3 = new createjs.Text(text.get("pg_pc"), font, perfect ? "#fff" : "#000");
		this.win3.name = "postgame win3";
		this.win3.x = this.x + 115;
		this.win3.y = this.y + 90;
	}

	this.star1 = new createjs.Bitmap(loader.getResult("star 1"));
	this.star1.name = "postgame star1";
	this.star1.x = this.x + 70;
	this.star1.y = this.y + 12;

	this.star2 = new createjs.Bitmap(loader.getResult("star " + (flawless ? 1 : 2)));
	this.star2.name = "postgame star2";
	this.star2.x = this.x + 70;
	this.star2.y = this.y + 47;

	if (canPerfect)
	{
		this.star3 = new createjs.Bitmap(loader.getResult("star " + (perfect ? 1 : 2)));
		this.star3.name = "postgame star3";
		this.star3.x = this.x + 70;
		this.star3.y = this.y + 82;
	}

	stage.addChild(this.shape);

	if (win)
	{
		stage.addChild(this.win1, this.win2, this.win3);
		stage.addChild(this.star1, this.star2, this.star3);
	}
	else
		stage.addChild(this.fail, this.tip);

	gamePause.kill();

	gameReset.kill();
	gameReset = new Button("menu reset", this.x + (canNextLevel ? 55 : 95), this.y + 130);
	gameReset.image.on("click", function(event)
	{
		reset();
	});

	this.replayText = new createjs.Text(text.get("pg_re"), font, "#fff");
	this.replayText.name = "postgame replay";
	this.replayText.x = this.x + (canNextLevel ? 71 : 111);
	this.replayText.y = this.y + 170;
	this.replayText.textAlign = "center";

	gameQuit.kill();
	gameQuit = new Button("menu quit", this.x + (canNextLevel ? 135 : 175), this.y + 130);
	gameQuit.image.on("click", function(event)
	{
		stop();
	});

	this.quitText = new createjs.Text(levelNum > -1 ? text.get("pg_me") : text.get("pg_ba"), font, "#fff");
	this.quitText.name = "postgame quit";
	this.quitText.x = this.x + (canNextLevel ? 151 : 191);
	this.quitText.y = this.y + 170;
	this.quitText.textAlign = "center";

	if (levelNum < 999 && canNextLevel)
	{
		this.gameNext = new Button("menu next", this.x + 215, this.y + 130);
		this.gameNext.image.on("click", function(event)
		{
			stop();

			if (levelNum < codes.length)
				play(codes[++levelNum - 1]);
			else
			{
				levelNum = 999;
				play(lastLevel);
			}
		});

		if (levelNum == codes.length / 2)
			nextTextText = text.get("pg_h1");
		else if (levelNum == codes.length)
			nextTextText = text.get("pg_la");
		else
			nextTextText = text.get("pg_lv") + " " + (levelNum % (codes.length / 2) + 1);

		this.nextText = new createjs.Text(nextTextText, font, "#fff");
		this.nextText.name = "postgame next";
		this.nextText.x = this.x + 231;
		this.nextText.y = this.y + 170;
		this.nextText.textAlign = "center";
	}

	if (gameGod != undefined)
		gameGod.kill();

	stage.addChild(this.replayText, this.quitText, this.nextText);

	if (canNextLevel)
	{
		var cookieCode = "stars_lvl_" + levelNum;
		var score = 1 + flawless + perfect;

		if (levelNum != -1 && (getCookie(cookieCode) == "" || getCookie(cookieCode) < score))
			setCookie(cookieCode, score);
	}

	// Fin du jeu!
	this.endGameItems = [];

	if (win && levelNum == 999)
	{

		this.endGameItems[0] = new createjs.Shape();
		this.endGameItems[0].name = "postgame backgroundend";
		this.endGameItems[0].graphics.setStrokeStyle(3).beginStroke("#9ab").beginFill("#678").drawRect(this.x, 100, this.width, 200);

		this.endGameItems[1] = new createjs.Text(text.get("pg_en1"), font, "#2f9");
		this.endGameItems[1].name = "postgame wp1";
		this.endGameItems[1].x = canvas.width / 2;
		this.endGameItems[1].y = 120;
		this.endGameItems[1].textAlign = "center";

		this.endGameItems[2] = new createjs.Text(text.get("pg_en2"), font, "#fff");
		this.endGameItems[2].name = "postgame wp2";
		this.endGameItems[2].x = canvas.width / 2;
		this.endGameItems[2].y = 187;
		this.endGameItems[2].textAlign = "center";
		this.endGameItems[2].lineHeight = 20;

		this.endGameItems[3] = new createjs.Text(text.get("pg_en3"), font, "#2f9");
		this.endGameItems[3].name = "postgame wp3";
		this.endGameItems[3].x = canvas.width / 2;
		this.endGameItems[3].y = 272;
		this.endGameItems[3].textAlign = "center";

		this.endGameItems[4] = new createjs.Bitmap(loader.getResult("menu godmode"));
		this.endGameItems[4].name = "postgame god";
		this.endGameItems[4].x = canvas.width / 2 - 16;
		this.endGameItems[4].y = 145;

		for (var i = 0; i < this.endGameItems.length; i++)
			stage.addChild(this.endGameItems[i]);
	}
}

PostGame.prototype.getTip = function()
{
	if (lang == "fr")
		return [""];

	var messages = [];
	var bullets = 1;

	for (var s = 0; s < shots.length; s++)
		bullets += shots[s] != "PlayerShot" && shots[s].x > -shots[s].width && shots[s].x < canvas.width + shots[s].width && shots[s].y > -shots[s].height && shots[s].y < canvas.height + -shots[s].height;

	// tué par ennemi
	if (lastHitShot == undefined)
	{
		if (enemy.hp < enemy.maxHp * 0.2)
			messages.push("Less than 20% left.\nWorst death ever.");
		else
		{
			messages.push("Tragic accident.");
			messages.push("Nice try?");
			messages.push("This won't work.\nThe enemy is too heavy.");
		}
	}
	// tué par bullet
	else
	{
		// type de bullet
		var color = Math.floor(lastHitShot.imageId / 100);
		var image = lastHitShot.imageId % 100;

		if (color == 4)
			messages.push("Green is not always good.");
		if (color == 9)
			messages.push("Pink bullets are not made\nof love.");

		if (image == 1)
			messages.push("Assassinated by a cute bubble.");
		if (image == 3)
			messages.push("Killed by a ninja attack!");
		if (image == 8)
			messages.push("That was a bullet, not a\nfruit. Don't eat it.");
		if (image == 10)
			messages.push("Death by a ball filled with\ntechnology.");
		if (image == 11)
		{
			messages.push("They do not come in peace.");
			messages.push("Headbutt!");
			messages.push("Hi, I'm a bullet.");
			messages.push("Don't talk to bullets\never again.");
		}
		if (image == 14)
			messages.push("Who brings missiles in a\nbullet hell game?");

		// bullets uniques
		if ((levelNum == 4 || levelNum == 19) && lastHitShot.imageId == 705)
			messages.push("That wasn't nice, I know.\nJust run as fast as possible!");
		if ((levelNum == 13 || levelNum == 28) && lastHitShot.imageId == 213)
			messages.push("Water doesn't extinguish\nfire, unfortunately.");
		if (levelNum == 999 && (lastHitShot.imageId == 808 || lastHitShot.imageId == 813))
			messages = ["The left minion has 100 HP,\nthe right one has 60 HP."];
		if (levelNum == 999 && lastHitShot.imageId == 809)
			messages = ["Move through the vault\nquickly and diagonally (45°)."];
		if (levelNum == 999 && lastHitShot.imageId == 811)
			messages = ["It's the last level.\nThey still refuse peace."];
		if (levelNum == 999 && lastHitShot.imageId == 901)
			messages = ["BUT WHY?"];
		if (lastHitShot.imageId == 304)
			messages.push("Hit by a banana.");

		// autres propriétés
		if (lastHitShot.size >= 1)
			messages.push("Was that a big bullet or\na second boss?");
		if (lastHitShot.speed == 0)
			messages.push("...by the slowest bullet\nin the game.");
		if (lastHitShot.speed >= 2.5)
		{
			messages.push("I didn't see this coming.");
			messages.push("This bullet was pretty angry.");
		}

		// combo
		if (frames - hitFrames[0] < 500)
			messages.push('Enemy achieved\n"Perfect combo"!');
		else if (frames - hitFrames[1] < 250)
			messages.push("2 hits in a row.\nBrutal ending.");

		// nombre de bullets
		if (bullets >= 400)
			messages.push(bullets + " bullets on screen.\nThis level is probably hard.");
		if (bullets >= 300 && bullets < 400)
			messages.push("There are never too many\nbullets in a bullet hell.");
		if (bullets <= 10)
			messages.push("...with only " + bullets + " bullets on\nthe screen. Well played!");
	}

	// niveau de HP
	if (enemy.hp == enemy.maxHp)
	{
		messages.push("What happened?");
		messages.push("The enemy isn't supposed\nto dodge bullets.");
	}
	if (enemy.hp >= enemy.maxHp * 0.4 && enemy.hp < enemy.maxHp * 0.5)
		messages.push("Less than 50% left.\nNever give up!");
	if (enemy.hp >= enemy.maxHp * 0.2 && enemy.hp < enemy.maxHp * 0.3)
		messages.push("Less than 30% left.\nSo close, yet so far.");
	if (enemy.hp >= enemy.maxHp * 0.1 && enemy.hp < enemy.maxHp * 0.2)
		messages.push("Less than 20% left.\nThat's too bad.");
	if (enemy.hp >= 2 && enemy.hp < enemy.maxHp * 0.1)
		messages.push(enemy.hp + " HP left...\nThat really was close.");
	if (enemy.hp == 1)
		messages.push("Wow, literally 1 HP.\nCouldn't be worse.");

	// position
	if (player.y < enemy.y)
		messages.push("The enemy cannot be attacked\nfrom the top edge.");
	if (player.x > canvas.width / 3 && player.y > canvas.height - 100)
		messages.push("Sorry, the user interface\nisn't bulletproof.");

	// durée
	if (frames - levelFrames >= 9000)
		messages.push("What a looooong battle...");
	if (frames - levelFrames >= 6000 && frames - levelFrames < 9000)
		messages.push("Well, that was an epic fight.");

	// niveau
	if (levelNum == 1)
		messages.push("Welcome to Bullet Hell Maker\nby the way!");
	if (levelNum == 3 || levelNum == 18)
		messages.push("Pro tip: hide under your\nhealth bar!");
	if (levelNum == 6 || levelNum == 21)
		messages.push("The enemy cannot use the\nsame attack twice in a row.");
	if (levelNum == 9 || levelNum == 24)
		messages.push("Try running in circles, this always works!");
	if (levelNum == 11 || levelNum == 26)
		messages.push("Yes, that huge pea is annoying.");
	if (levelNum == 14 || levelNum == 29)
		messages.push("These bullets are 100% natural.");
	if (levelNum == 30)
		messages.push("The end is near,\ndon't give up now!");
	if (levelNum == 999)
		messages.push("This is the last level,\nthat's why it's not easy.");

	// autres
	if (killedBullets >= 30)
		messages.push(killedBullets + " bullets have been\nslain and avenged.");

	if (messages.length == 0)
	{
		messages.push("Bullets have won the battle.");
		messages.push("The evil bullets are going\nto rule the galaxy!");
		messages.push("Maybe next time?");
		messages.push("We can do it.");
		messages.push("The players can never lose.");
		messages.push("Your weapons have been eaten.");
		messages.push("Epic fail.");
		messages.push("Mission failed successfully.");
		messages.push("Sorry.");
	}

	return messages[Math.floor(Math.random() * messages.length)];
}

PostGame.prototype.kill = function()
{
	stage.removeChild(this.shape);

	if (stage.contains(this.win1))
	{
		stage.removeChild(this.win1, this.win2, this.win3);
		stage.removeChild(this.star1, this.star2, this.star3);
	}
	else
		stage.removeChild(this.fail, this.tip);

	stage.removeChild(this.replayText, this.quitText, this.nextText);

	for (var i = 0; i < this.endGameItems.length; i++)
		stage.removeChild(this.endGameItems[i]);

	if (this.gameNext != undefined)
		this.gameNext.kill();

	postGame = undefined;
}

PostGame.prototype.toString = function()
{
	return "PostGame";
}