function Player(num)
{
	this.player2 = num == 2;
	this.image = new createjs.Bitmap(loader.getResult("player" + (this.player2 ? " 2" : "")));
	this.jetpack = new createjs.Bitmap(loader.getResult("jetpack"));

	this.x = canvas.width / 2;
	this.y = canvas.height - 50;
	this.width = this.image.getBounds().width;
	this.height = this.image.getBounds().height;

	this.image.name = "player";
	this.image.x = this.x;
	this.image.y = this.y;
	this.image.regX = this.width / 2;
	this.image.regY = this.height / 2;

	this.jetpack.x = this.image.x;
	this.jetpack.y = this.image.y + 10;
	this.jetpack.regX = this.jetpack.getBounds().width / 2;
	this.jetpack.regY = 0;

	this.speed = 4;

	this.maxHp = 3;
	this.hp = this.maxHp;
	this.noHit = 0;

	this.hpBarB = new createjs.Shape();
	this.hpBarB.name = "player hpbar b";
	this.hpBarB.graphics.beginFill(!this.player2 ? "#044" : "#042").beginStroke(!this.player2 ? "#0ff" : "#0f9").drawRect((canvas.width - enemy.width) / 2, canvas.height - (player2Mode && !this.player2 ? 37 : 17), enemy.width, 12);
	this.hpBarF = new createjs.Shape();
	this.hpBarF.name = "player hpbar f";
	this.hpBarF.graphics.beginFill(godMode ? "#fd9" : (!this.player2 ? "#0ff" : "#0f9")).drawRect((canvas.width - enemy.width) / 2, canvas.height - (player2Mode && !this.player2 ? 37 : 17), enemy.width, 12);

	if (this.player2)
		stage.addChildAt(this.hpBarB, this.hpBarF, stage.getChildIndex(player.image) - 1);
	else
		stage.addChild(this.hpBarB, this.hpBarF);

	if (player2Mode)
	{
		this.target = new createjs.Bitmap(loader.getResult("target"));
		this.target.name = "player target";
		this.target.regX = this.target.getBounds().width / 2;
		this.target.regY = this.target.getBounds().height / 2;
		this.target.visible = false;
	}

	this.bomb = new createjs.Bitmap(loader.getResult("bomb"));
	this.bomb.x = player2Mode && this.player2 ? 32 : 5;
	this.bomb.y = canvas.height - 29;
	this.bomb.name = "player bomb";

	stage.addChild(this.image, this.jetpack, this.bomb, this.target);
	entities.push(this);
}

Player.prototype.ontick = function()
{
	if (paused)
		return;

	// invulnérabilité
	if (this.noHit > 0)
	{
		this.noHit--;

		if (this.noHit > 174)
		{
			this.image.scaleX = (this.noHit - 175) / 25 + 1;
			this.image.scaleY = (this.noHit - 175) / 25 + 1;
		}
	}
	if (this.noHit == 1)
	{
		this.image.shadow = undefined;

		if (!godMode)
		{
			stage.removeChild(this.hpBarF);

			this.hpBarF = new createjs.Shape();
			this.hpBarF.name = "player hpbar f";
			this.hpBarF.graphics.beginFill(!this.player2 ? "#0ff" : "#0f9").drawRect((canvas.width - enemy.width) / 2, canvas.height - (player2Mode && !this.player2 ? 37 : 17), enemy.width * this.hp / this.maxHp, 12);

			stage.addChildAt(this.hpBarF, stage.getChildIndex(player.image));
		}
	}

	var oldX = this.x, oldY = this.y;

	if (this.hp > 0)
	{
		

		// déplacement souris
		if ((!player2Mode && mouseMode) || (player2Mode && !this.player2))
		{
			if (Math.abs(stage.mouseX - this.image.x) > 3 || Math.abs(stage.mouseY - this.y) > 3)
			{
				this.direction = direction(this.x, this.y, stage.mouseX, stage.mouseY);
				this.x += this.speed * Math.cos(this.direction * (Math.PI / -180));
				this.y += this.speed * Math.sin(this.direction * (Math.PI / -180));
			}
			else
			{
				this.x = stage.mouseX;
				this.y = stage.mouseY;
			}
		}
		// déplacement clavier
		if ((!player2Mode && !mouseMode) || (player2Mode && this.player2))
		{
			var s = this.speed;
			var left = keysPressed.indexOf(37) > -1 || keysPressed.indexOf(65) > -1;
			var up = keysPressed.indexOf(38) > -1 || keysPressed.indexOf(87) > -1;
			var right = keysPressed.indexOf(39) > -1 || keysPressed.indexOf(68) > -1;
			var down = keysPressed.indexOf(40) > -1 || keysPressed.indexOf(83) > -1;

			if (left)
				s *= (up || down ? Math.sqrt(0.5) : 1);
			if (up && s == this.speed)
				s *= (left || right ? Math.sqrt(0.5) : 1);
			if (right && s == this.speed)
				s *= (up || down ? Math.sqrt(0.5) : 1);
			if (down && s == this.speed)
				s *= (left || right ? Math.sqrt(0.5) : 1);

			if (keysPressed.indexOf(16) > -1)
				s *= 0.33;

			if (left)
				this.x -= s;
			if (up)
				this.y -= s;
			if (right)
				this.x += s;
			if (down)
				this.y += s;
		}

		if (this.x < this.width / 2)
			this.x = this.width / 2;
		if (this.x > canvas.width - this.width / 2)
			this.x = canvas.width - this.width / 2;
		if (this.y < this.height / 2)
			this.y = this.height / 2;
		if (this.y > canvas.height - this.height / 2)
			this.y = canvas.height - this.height / 2;
	}
	else
	{
		this.y += 4;
		this.image.rotation++;
	}

	this.image.x = this.x;
	this.image.y = this.y;
	this.jetpack.x = this.image.x;
	this.jetpack.y = this.image.y + 10;

	if (player2Mode)
	{
		this.target.x = this.x;
		this.target.y = this.y;
		this.target.alpha = frames % 10 > 4;
	}

	if (this.hp == 0)
		return;

	if (frames % 4 == 0)
		this.jetpack.scaleY = 0.7 + (frames % 20) * 0.01;
	if (this.x == oldX)
		this.jetpack.rotation += this.jetpack.rotation > 0 ? -3 : 3;
	if (this.x < oldX && this.jetpack.rotation > -45)
		this.jetpack.rotation -= 3;
	if (this.x > oldX && this.jetpack.rotation < 45)
		this.jetpack.rotation += 3;
	if (this.y < oldY)
		this.jetpack.scaleY += 0.3;
	if (this.y > oldY)
		this.jetpack.scaleY = 0.2;

	// collision ennemi
	if (!godMode && enemy.hp > 0 && distance(this.x, this.y, enemy.x, enemy.y) < enemy.radius + 10)
	{
		lastHitShot = undefined;
		this.hit(true);
	}

	// tir
	if (bs.started && postGame == undefined && frames % 25 == 0)
	{
		createjs.Sound.play("shot player");
		new PlayerShot(-10, this.player2);
		new PlayerShot(10, this.player2);
	}
}

Player.prototype.useBomb = function(mouse)
{
	var pl = player2Mode && !mouse ? player2 : player;

	if (paused || !bs.started || activity != 2 || postGame != undefined)
		return;
	if ((mouse && !player2Mode && !mouseMode) || (!mouse && !player2Mode && mouseMode))
		return;
	if (mouse && stage.mouseX > canvas.width - 150 && stage.mouseY > canvas.height - 40)
		return;
	if (pl.bomb.alpha != 1)
		return;

	itemsUsed++;
	createjs.Sound.play("bomb");
	pl.bomb.alpha = 0.15;
		/*this.slomo = true;

		schedule(400, function(arg)
		{
			if (arg)
				pl.slomo = false;
			else
				pl.slomo = false;
		}, !this.player2);*/
	for (var i = 0; i < shots.length; i++)
	{
		var s = shots[i];

		if ("" + s != "PlayerShot" && !s.immunity)
		{
			if (s.health == 0)
			{
				s.direction = direction(s.x, s.y, pl.x, pl.y) + 180;
				s.life = 12;
				s.speed = 10;
				s.ghost = true;
				s.triggerDelay = -100;
				s.triggerDelay2 = -100;
			}
			else
			{
				s.health -= 49;

				if (s.health < 1)
					s.health = 1;

				s.hit();
			}
		}
	}

	enemy.hp -= 24;

	if (enemy.hp < 1)
		enemy.hp = 1;

	enemy.hit();
}

Player.prototype.hit = function(kill)
{
	if (enemy.hp < 1)
		return;

	if (kill)
		this.hp = 1;
	if (godMode)
		this.hp++;

	createjs.Sound.play("hit");

	if (comboValue.text > 19)
	{
		comboValueLong.text = comboValue.text;
		comboValueLong.color = comboValue.color;
		comboTitle.text = "";
		comboValue.text = "";

		schedule(150, function(arg)
		{
			comboValueLong.text = "";
		});
	}

	// perdu
	if (--this.hp == 0)
	{
		createjs.Sound.play("fail");
		this.jetpack.visible = false;

		if (gameForeground == undefined || gameForeground.name != "death foreground")
		{
			gameForeground = new createjs.Shape();
			gameForeground.name = "death foreground";
			gameForeground.graphics.beginFill("#0006").drawRect(0, 0, canvas.width, canvas.height);
			gameForeground.alpha = 0;

			stage.addChildAt(gameForeground, stage.getChildIndex(gamePause.image) - 1);

			new PostGame(false);
		}
	}
	else
	{
		this.image.shadow = new createjs.Shadow("#cff", 0, 0, 10);
		this.noHit = 200;
	}

	if (!godMode)
	{
		stage.removeChild(this.hpBarF);

		this.hpBarF = new createjs.Shape();
		this.hpBarF.name = "player hpbar f";
		this.hpBarF.graphics.beginFill(!this.player2 ? "#cff" : "#cfd").drawRect((canvas.width - enemy.width) / 2, canvas.height - (player2Mode && !this.player2 ? 37 : 17), enemy.width * this.hp / this.maxHp, 12);

		stage.addChildAt(this.hpBarF, stage.getChildIndex(player.image));
	}
}

Player.prototype.kill = function()
{
	this.remove = true;
	stage.removeChild(this.image, this.hpBarB, this.hpBarF, this.jetpack, this.bomb, this.target);
}

Player.prototype.toString = function()
{
	return "Player";
}