function Enemy()
{
	var imageNum = "";

	if (levelNum > 0 && levelNum < 999)
		imageNum += " lv" + (levelNum > codes.length / 2 ? levelNum - codes.length / 2 : levelNum);

	this.image = new createjs.Bitmap(loader.getResult("enemy" + imageNum));

	this.x = canvas.width / 2;
	this.y = -110;
	this.width = this.image.getBounds().width;
	this.height = this.image.getBounds().height;

	this.image.name = "enemy";
	this.image.x = this.x;
	this.image.y = this.y;
	this.image.regX = this.width / 2;
	this.image.regY = this.height / 2;

	if (levelNum > 0 && levelNum < 999)
	{
		this.head = new createjs.Bitmap(loader.getResult("enemy head" + imageNum));
		this.head.name = "enemy head";
		this.head.regX = this.head.getBounds().width / 2;
		this.head.regY = this.head.getBounds().height / 2;

		this.armL = new createjs.Bitmap(loader.getResult("enemy arm" + imageNum));
		this.armL.name = "enemy arml";
		this.armL.regX = this.armL.getBounds().width / 2;
		this.armL.regY = this.armL.getBounds().height / 2;

		this.armR = new createjs.Bitmap(loader.getResult("enemy arm" + imageNum));
		this.armR.name = "enemy armr";
		this.armR.regX = this.armR.getBounds().width / 2;
		this.armR.regY = this.armR.getBounds().height / 2;
		this.armR.scaleX = -1;

		this.armAnimation = 0;
	}

	this.speed = 2;

	this.radius = this.width / 2;

	this.maxHp = levelNum > codes.length / 2 ? 400 : 300;
	this.maxHp *= player2Mode ? 4 / 3 : 1;
	this.hp = this.maxHp;

	this.hpBarB = new createjs.Shape();
	this.hpBarB.name = "enemy hpbar b";
	this.hpBarB.graphics.beginFill("#420").beginStroke("#fa0").drawRect(canvas.width / 4, 5, canvas.width / 2, 12);
	this.hpBarF = new createjs.Shape();
	this.hpBarF.name = "enemy hpbar f";
	this.hpBarF.graphics.beginFill("#fa0").drawRect(canvas.width / 4, 5, canvas.width / 2, 12);

	stage.addChild(this.image, this.head, this.armL, this.armR);
	stage.addChild(this.hpBarB, this.hpBarF);
	entities.push(this);
}

Enemy.prototype.ontick = function()
{
	if (paused)
		return;

	if (--this.shadowDelay == 0)
		this.image.shadow = undefined;

	// déplacement
	if (this.y < 90 && !bs.started)
	{
		this.y += this.y < 60 ? this.speed : this.speed / 2;
		this.image.y = this.y;
	}
	if (this.moveMode != undefined && this.moveMode > 0 && this.hp > 0)
	{
		// monter
		if (this.moveMode == 1 && this.y > 90)
			this.y -= this.y > 120 ? this.speed : this.speed / 2;
		if ((this.moveMode == 3 || this.moveMode == 5) && this.y > this.radius)
			this.y -= this.speed;

		// descendre
		if (this.moveMode == 1 && this.y < 90)
			this.y += this.y < 60 ? this.speed : this.speed / 2;

		// aller au centre X
		if (this.moveMode == 1 || this.moveMode == 2)
		{
			if (this.x < canvas.width / 2)
				this.x += this.x < canvas.width / 2 - 30 ? this.speed : this.speed / 2;
			if (this.x > canvas.width / 2)
				this.x -= this.x > canvas.width / 2 + 30 ? this.speed : this.speed / 2;
		}

		// aller au centre Y
		if (this.moveMode == 2 && this.y < canvas.height / 2)
			this.y += this.y < canvas.height / 2 - 30 ? this.speed : this.speed / 2;

		// rester au X du joueur
		if (this.moveMode == 3)
		{
			if (this.x < playerTarget.x && this.x + this.radius < canvas.width)
				this.x += this.speed;
			if (this.x > playerTarget.x && this.x - this.radius > 0)
				this.x -= this.speed;
		}

		// poursuivre joueur
		if (this.moveMode == 4)
		{
			this.direction = direction(this.x, this.y, playerTarget.x, playerTarget.y);
			this.x += this.speed * Math.cos(this.direction * (Math.PI / -180));
			this.y += this.speed * Math.sin(this.direction * (Math.PI / -180));
		}

		// aller gauche-droite
		if (this.moveMode == 5)
		{
			if (this.right == undefined)
				this.right = this.x < canvas.width / 2;
			if (this.x > canvas.width - 75)
				this.right = false;
			if (this.x < 75)
				this.right = true;
			if (this.right && this.x < canvas.width - 75)
				this.x += this.x < canvas.width - 105 ? this.speed : this.speed / 2;
			if (!this.right && this.x > 75)
				this.x -= this.x > 105 ? this.speed : this.speed / 2;
		}
		else
			this.right = undefined;
	}

	// animation
	if (this.hp > 0)
	{
		this.image.x = this.x;
		this.image.y = this.y + Math.cos(frames / 180 * Math.PI) * 4;

		if (this.head != undefined)
		{
			this.head.x = this.x;
			this.head.y = this.y - 30 + Math.cos(frames / 180 * Math.PI) * 10;
			this.armL.x = this.x - 90;
			this.armL.y = this.y + 50 + Math.cos(frames / 180 * Math.PI) * 10;
			this.armR.x = this.x + 90;
			this.armR.y = this.y + 50 + Math.cos(frames / 180 * Math.PI) * 10;
		}
	}

	// animation de mort
	if (this.hp <= 0)
	{
		if (this.death)
		{
			this.image.scaleX += 0.03;
			this.image.scaleY -= 0.01;

			if (this.image.scaleY < 0)
				this.image.alpha = 0;
		}
		else
		{
			this.image.x += 0.4;
			this.image.y += 0.8;
			this.image.scaleX -= 0.004;
			this.image.scaleY -= 0.004;
			this.image.rotation += 0.5;
			this.image.alpha -= 0.007;

			if (this.head != undefined)
			{
				this.head.x += 0.45;
				this.head.y += 1;
				this.head.scaleX -= 0.004;
				this.head.scaleY -= 0.004;
				this.head.rotation += 0.5;
				this.head.alpha -= 0.007;

				this.armL.x += 0.4;
				this.armL.y += 0.8;
				this.armL.scaleX -= 0.004;
				this.armL.scaleY -= 0.004;
				this.armL.rotation -= 1.5;
				this.armL.alpha -= 0.007;

				this.armR.x += 0.4;
				this.armR.y += 0.8;
				this.armR.scaleX += 0.004;
				this.armR.scaleY -= 0.004;
				this.armR.rotation += 1;
				this.armR.alpha -= 0.007;
			}
		}

		if (this.image.alpha < 0 && this.death == undefined)
		{
			stage.removeChild(this.image);
			createjs.Sound.play("shot4");

			var x = this.image.x;
			var y = this.image.y;

			this.death = 1;
			this.image = new createjs.Bitmap(loader.getResult("flash"));
			this.image.x = x;
			this.image.y = y;
			this.image.regX = this.image.getBounds().width / 2;
			this.image.regY = this.image.getBounds().height / 2;
			this.image.scaleX = 0;
			this.image.scaleY = 0.5;
			this.image.rotation = Math.random() * 180;

			stage.addChildAt(this.image, stage.getChildIndex(postGame.shape));
		}
	}
}

Enemy.prototype.hit = function()
{
	if (player.hp < 1 || (player2Mode && player2.hp < 1))
		return;

	createjs.Sound.play("hit2");

	// gagné
	if (--this.hp <= 0)
	{
		createjs.Sound.play("win");

		gameForeground = new createjs.Shape();
		gameForeground.name = "win foreground";
		gameForeground.graphics.beginFill("#aaf6").drawRect(0, 0, canvas.width, canvas.height);
		gameForeground.alpha = 0;

		stage.addChildAt(gameForeground, stage.getChildIndex(gamePause.image) - 1);

		new PostGame(true);
	}

	stage.removeChild(this.hpBarF);

	this.shadowDelay = 3;
	this.hpBarF = new createjs.Shape();
	this.hpBarF.name = "enemy hpbar f";
	this.hpBarF.graphics.beginFill("#fa0").drawRect(canvas.width / 4, 5, canvas.width / 2 * this.hp / this.maxHp, 12);

	if (this.hp > 0)
		this.image.shadow = new createjs.Shadow("#f64", 0, 0, 10);

	stage.addChildAt(this.hpBarF, stage.getChildIndex(player.image));
}

Enemy.prototype.kill = function()
{
	//entities.splice(entities.indexOf(this), 1);
	this.remove = true;
	stage.removeChild(this.image, this.hpBarB, this.hpBarF);
	stage.removeChild(this.head, this.armL, this.armR);
}

Enemy.prototype.toString = function()
{
	return "Enemy";
}