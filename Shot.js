function Shot(data)
{
	this.imageId = data.image != undefined ? data.image : defImage;
	this.image = new createjs.Sprite(sheet);
	this.image.gotoAndStop(getImageIndex(this.imageId));

	this.frames = 0;
	this.sound = data.sound != undefined ? data.sound : 0;
	this.size = (data.size != undefined ? data.size : defSize) / 500;
	this.growth = data.growth;
	this.width = this.image.getBounds().width * this.size;
	this.height = this.image.getBounds().height * this.size;
	this.x = data.x != undefined ? data.x : 0;
	this.y = data.y != undefined ? data.y : 0;
	this.speed = (data.speed != undefined ? data.speed : defSpeed) / 100;
	this.acceleration = data.acceleration != undefined ? data.acceleration : 0;
	this.life = data.life != undefined ? data.life : defLife;
	this.vanish = data.options != undefined && data.options.indexOf("vanish") > -1;
	this.ghost = data.options != undefined && data.options.indexOf("ghost") > -1;
	this.health = data.health != undefined ? data.health : 0;
	this.gravityDirection = data.gravity_angle;
	this.gravityForce = data.gravity_force != undefined ? data.gravity_force : defGravityForce;
	this.triggerID = data.trigger_id;
	this.triggerDelay = data.trigger_delay != undefined ? data.trigger_delay : defTriggerDelay;
	this.triggerID2 = data.trigger_id2;
	this.triggerDelay2 = data.trigger_delay2 != undefined ? data.trigger_delay2 : defTriggerDelay;
	this.immunity = data.options != undefined && data.options.indexOf("immunity") > -1;

	var placed = false;

	if (data.options != undefined)
	{
		placed = data.options.indexOf("player_x") > -1 || data.options.indexOf("player_y") > -1;

		if (data.options.indexOf("player_x") > -1)
			this.x += playerTarget.x;
		if (data.options.indexOf("player_y") > -1)
			this.y += playerTarget.y;
	}
	if (!placed && (data.options == undefined || data.options.indexOf("absolute_position") == -1))
	{
		this.x += enemy.x;
		this.y += enemy.y;
	}

	if (this.gravityDirection != undefined)
		this.gravityDirection -= 90;

	this.direction = data.angle != undefined ? data.angle - 90 : -90;

	if (data.options != undefined && data.options.indexOf("angle_player") > -1)
		this.direction += direction(this.x, this.y, playerTarget.x, playerTarget.y) + 90;

	this.direction_lock = this.direction;
	this.x_lock = this.x;
	this.y_lock = this.y;

	this.image.name = "shot";
	this.image.x = this.x;
	this.image.y = this.y;
	this.image.regX = this.image.getBounds().width / 2;
	this.image.regY = this.image.getBounds().height / 2;
	this.image.rotation = this.direction * -1;
	this.image.scaleX = this.size;
	this.image.scaleY = this.size;

	this.radius = this.width / 2;
	this.exitToleranceH = this.width * (this.ghost ? 50 : 1);
	this.exitToleranceV = this.height * (this.ghost ? 50 : 1);

	if (this.sound == 0)
	{
		if ((data.options != undefined && data.options.indexOf("mute") > -1) || this.x < -this.width || this.x > canvas.width + this.width || this.y < -this.height || this.y > canvas.height + -this.height || this.size == 0)
			this.sound = 1;
		else
		{
			this.sound = 2;

			if (data.repeat_delay != undefined && data.repeat_delay < 31)
				this.sound = 3;
			if ((data.repeat_times != undefined && data.repeat_delay == undefined) || (data.repeat_delay != undefined && data.repeat_delay < 11))
				this.sound = 4;
		}
	}

	stage.addChildAt(this.image, stage.getChildIndex(enemy.hpBarB));
	entities.push(this);
	shots.push(this);

	if (this.health > 0)
		hittableShots.push(this);
}

Shot.prototype.ontick = function()
{
	if (paused)
		return;

	this.life--;
	this.frames++;

	// grossissement
	if (this.growth != undefined)
	{
		this.image.scaleX += this.growth / 10000;
		this.image.scaleY += this.growth / 10000;
		this.radius += this.growth / 200;
	}

	// trigger attack
	if (this.triggerID != undefined && shots.length < 1000 & this.frames != 0 && this.frames % this.triggerDelay == 0)
	{
		var data = copyMap(bs.attacks[this.triggerID]);

		if (data.options != undefined)
		{
			data.options = data.options.slice();

			if (data.options.indexOf("angle_player") > -1)
				data.angle = data.angle != undefined ? data.angle - 90 : 0;
		}

		if (data.options == undefined || (data.options.indexOf("absolute_position") == -1 && data.options.indexOf("player_x") == -1 && data.options.indexOf("player_y") == -1))
		{
			data.x = (data.x != undefined ? data.x : 0) + this.x;
			data.y = (data.y != undefined ? data.y : 0) + this.y;

			if (data.options == undefined)
				data.options = ["absolute_position"];
			else
				data.options.push("absolute_position");
		}

		bs.shoot(data);
	}
	// trigger attack 2
	if (this.triggerID2 != undefined && shots.length < 1000 & this.frames != 0 && this.frames % this.triggerDelay2 == 0)
	{
		var data = copyMap(bs.attacks[this.triggerID2]);

		if (data.options != undefined)
		{
			data.options = data.options.slice();

			if (data.options.indexOf("angle_player") > -1)
				data.angle = data.angle != undefined ? data.angle - 90 : 0;
		}

		if (data.options == undefined || (data.options.indexOf("absolute_position") == -1 && data.options.indexOf("player_x") == -1 && data.options.indexOf("player_y") == -1))
		{
			data.x = (data.x != undefined ? data.x : 0) + this.x;
			data.y = (data.y != undefined ? data.y : 0) + this.y;

			if (data.options == undefined)
				data.options = ["absolute_position"];
			else
				data.options.push("absolute_position");
		}

		bs.shoot(data);
	}

	// déplacement
	var oldX = this.x, oldY = this.y;

	this.speed += this.acceleration / 10000;

	if (this.acceleration != 0 && ((this.speed > 0 && this.speed + this.acceleration / 10000 < 0) || (this.speed < 0 && this.speed + this.acceleration / 10000 > 0)))
	{
		this.speed = 0;
		this.acceleration = 0;
	}

	// slomo utilisé
	//var speedA = this.speed * (player.slomo && distance(player.x, player.y, this.x, this.y) < 200 ? 0.1 : 1);
	var speedA = this.speed;

	if (speedA != 0)
	{
		this.x += speedA * Math.cos(this.direction * (Math.PI / -180));
		this.y += speedA * Math.sin(this.direction * (Math.PI / -180));

		// sortie
		if (this.gravityDirection == undefined && this.life > 500)
		{
			var dirPos = this.direction;

			if (dirPos < 0)
				dirPos += 360 * (Math.ceil(dirPos / -360));

			dirPos %= 360;

			if ((this.x < -this.exitToleranceH && dirPos > 90 && dirPos < 270)
			 || (this.x > canvas.width + this.exitToleranceH && (dirPos < 90 || dirPos > 270))
			 || (this.y < -this.exitToleranceV && dirPos > 0 && dirPos < 180)
			 || (this.y > canvas.height + this.exitToleranceV && dirPos > 180))
			 this.kill();
		}
	}

	// déplacement par gravité
	if (this.gravityDirection != undefined)
	{
		this.x += this.frames * 0.0001 * this.gravityForce * Math.cos(this.gravityDirection * (Math.PI / -180));
		this.y += this.frames * 0.0001 * this.gravityForce * Math.sin(this.gravityDirection * (Math.PI / -180));

		if (noBulletRotation.indexOf(this.imageId % 100) == -1)
			this.image.rotation = direction(this.x, this.y, oldX, oldY) * -1 + 180;

		// sortie
		if (this.life > 500)
		{
			var dirPos = this.gravityDirection;

			if (dirPos < 0)
				dirPos += 360 * (Math.ceil(dirPos / -360));

			dirPos %= 360;

			if ((this.x < -this.exitToleranceH && dirPos > 90 && dirPos < 270)
			 || (this.x > canvas.width + this.exitToleranceH && (dirPos < 90 || dirPos > 270))
			 || (this.y < -this.exitToleranceV && dirPos > 0 && dirPos < 180)
			 || (this.y > canvas.height + this.exitToleranceV && dirPos > 180))
			 this.kill();
		}
	}

	this.image.x = this.x;
	this.image.y = this.y;
	
	// collision joueur
	if (!this.ghost && player.noHit == 0 && player.hp > 0 && distance(this.x, this.y, player.x, player.y) < this.radius)
	{
		if (this.health == 0)
			this.kill();

		lastHitShot = this;
		hitFrames.push(frames);
		player.hit();
	}
	if (player2Mode && !this.ghost && player2.noHit == 0 && player2.hp > 0 && distance(this.x, this.y, player2.x, player2.y) < this.radius)
	{
		if (this.health == 0)
			this.kill();

		player2.hit();
	}

	// expiration
	if (this.life < 12 && this.vanish)
		this.image.alpha = this.life / 12;
	if (this.life == 0 || (this.image.scaleX < 0 && this.growth != undefined && this.growth < 0))
		this.kill();
}

Shot.prototype.hit = function()
{
	if (--this.health == 0)
	{
		createjs.Sound.play("shot4", {volume: 0.8});
		killedBullets++;

		if (killedBulletsText != undefined)
		{
			deadBullets.alpha = 1;
			killedBulletsText.text++;
			killedBulletsText.alpha = 1;
		}

		this.life = 12;
		this.vanish = true;
		this.ghost = true;
		hittableShots.splice(hittableShots.indexOf(this), 1);
	}
	else
		createjs.Sound.play("hit2");
}

Shot.prototype.kill = function()
{
	this.remove = true;
	shots.splice(shots.indexOf(this), 1);

	if (hittableShots.indexOf(this) > -1)
		hittableShots.splice(hittableShots.indexOf(this), 1);

	stage.removeChild(this.image);
}

Shot.prototype.toString = function()
{
	return "Shot";
}