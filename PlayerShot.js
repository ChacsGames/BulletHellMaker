function PlayerShot(x, p2)
{
	if (!stage.contains(gameBackground))
		return;

	this.image = new createjs.Bitmap(loader.getResult("player shot"));

	this.frame = frames;
	this.size = 0.2;
	this.width = this.image.getBounds().width * this.size;
	this.height = this.image.getBounds().height * this.size;
	this.x = (!p2 ? player.x : player2.x) + x;
	this.y = (!p2 ? player.y : player2.y) - 6;
	this.speed = 6;
	this.direction = 90;

	this.image.name = "playershot";
	this.image.x = this.x;
	this.image.y = this.y;
	this.image.regX = this.image.getBounds().width / 2;
	this.image.regY = this.image.getBounds().height / 2;
	this.image.rotation = 90;
	this.image.scaleX = this.size / 4;
	this.image.scaleY = this.size * 4;

	this.radius = this.width / 2;

	stage.addChild(this.image);
	entities.push(this);
	shots.push(this);
}

PlayerShot.prototype.ontick = function()
{
	if (paused)
		return;

	if (!this.death)
	{
		// animation début
		this.image.scaleX = this.image.scaleX < this.size ? this.image.scaleX + 0.03 : this.size;
		this.image.scaleY = this.image.scaleY > this.size ? this.image.scaleY - 0.1 : this.size;

		// déplacement
		this.x += this.speed * Math.cos(this.direction * (Math.PI / -180));
		this.y += this.speed * Math.sin(this.direction * (Math.PI / -180));

		this.image.x = this.x;
		this.image.y = this.y;

		// collision ennemi
		if (enemy.hp > 0 && distance(this.x, this.y, enemy.x, enemy.y) < enemy.radius)
		{
			this.deathAnim();

			// combo
			if (!player2Mode)
			{
				if (comboValue.text == "" || comboHitFrame < this.frame - 30)
				{
					if (comboHitFrame < this.frame - 30 && comboValue.text > 19)
					{
						comboValueLong.text = comboValue.text;
						comboValueLong.color = comboValue.color;

						schedule(150, function(arg)
						{
							comboValueLong.text = "";
						});
					}

					comboTitle.visible = false;
					comboValue.visible = false;
					comboTitle.text = "-COMBO-";
					comboValue.text = 1;
					comboValue.color = "#ff0";
				}
				else
				{
					comboValue.text++;
					comboTitle.visible = comboValue.text > 19;
					comboValue.visible = comboValue.text > 19;

					if (comboValue.text > 49)
						comboValue.color = "#fb0";
					if (comboValue.text > 99)
					{
						comboValue.color = "#f60";
						combo100done = true;
					}
					if (comboValue.text > 199)
						comboValue.color = "#f00";
					if (comboValue.text > 299)
						comboValue.color = "#f07";
					if (comboValue.text > 399)
						comboValue.color = "#804";
				}
			}

			comboHitFrame = this.frame;

			enemy.hit();
		}

		// collision balle
		for (var i = 0; i < hittableShots.length; i++)
		{
			var bullet = hittableShots[i];

			if (distance(this.x, this.y, bullet.x, bullet.y) < bullet.radius)
			{
				bullet.hit();
				this.deathAnim();
			}
		}
	}
	else
	{
		// animation quand ennemi touché
		this.image.scaleX += 0.02;
		this.image.scaleY += 0.02;
		this.image.alpha -= 0.05;
		this.image.rotation += 3;

		if (this.image.alpha < 0)
			this.kill();
	}

	// sortie
	if (this.y < -100)
		this.kill();
}

PlayerShot.prototype.deathAnim = function()
{
	stage.removeChild(this.image);

	this.death = 1;
	this.image = new createjs.Bitmap(loader.getResult("flash"));
	this.image.x = this.x;
	this.image.y = this.y;
	this.image.regX = this.image.getBounds().width / 2;
	this.image.regY = this.image.getBounds().height / 2;
	this.image.scaleX = 0.1;
	this.image.scaleY = 0.1;
	this.image.rotation = Math.random() * 360;

	stage.addChild(this.image);
}

PlayerShot.prototype.kill = function()
{
	this.remove = true;
	shots.splice(shots.indexOf(this), 1);
	stage.removeChild(this.image);
}

PlayerShot.prototype.toString = function()
{
	return "PlayerShot";
}