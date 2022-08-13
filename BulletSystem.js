function BulletSystem(code)
{
	this.attacks = {};
	this.firstAttacks = [];

	if (debugMode)
		console.log("Data: ", code.attacks);

	for (var s = 0; s < code.attacks.length; s++)
	{
		this.attacks[code.attacks[s].id] = code.attacks[s];

		// recherche des attaques de départ
		if (code.attacks[s].options != undefined && code.attacks[s].options.indexOf("start") > -1)
			this.firstAttacks.push(code.attacks[s]);
	}

	if (this.firstAttacks.length == 0)
		this.firstAttacks[0] = code.attacks[0];

	for (var f = 0; f < this.firstAttacks.length; f++)
	{
		schedule(150, function(arg)
		{
			enemy.speed = 1.3;
			bs.started = true;
			bs.shoot(bs.firstAttacks[arg]);
		}, f);
	}
}

BulletSystem.prototype.shoot = function(data, repeats_left, repeats_done, repeat_shot)
{
	if (!stage.contains(gameBackground) || player.hp == 0 || enemy.hp == 0)
		return;

	var number = data.number != undefined ? data.number : defNumber;
	var times = data.repeat_times != undefined ? data.repeat_times : 0;

	var playSound = 1;

	// mouvement ennemi
	if (data.move != undefined)
		enemy.moveMode = data.move;

	if (levelNum > 0 && repeats_left == undefined)
		enemy.armAnimation = 50;

	for (var b = 0; b < number; b++)
	{
		if (shots.length < 1000)
		{
			var s = new Shot(data);

			if (b == 0 && repeats_left == undefined)
				repeat_shot = s;

			// repeat lock
			if (data.options != undefined && data.options.indexOf("repeat_lock") > -1)
			{
				s.direction = repeat_shot.direction_lock;
				s.image.rotation = s.direction * -1;
				s.x = repeat_shot.x_lock;
				s.y = repeat_shot.y_lock;
				s.image.x = s.x;
				s.image.y = s.y;
			}

			// données aléatoires
			if (data.size_random != undefined)
			{
				s.size += Math.random() * data.size_random / 250 - data.size_random / 500;
				s.width = s.image.getBounds().width * s.size;
				s.height = s.image.getBounds().height * s.size;
				s.image.scaleX = s.size;
				s.image.scaleY = s.size;
				s.radius = s.width / 2;
			}
			if (data.speed_random != undefined)
				s.speed += Math.random() * data.speed_random / 50 - data.speed_random / 100;
			if (data.angle_random != undefined)
			{
				s.direction += Math.random() * 2 * data.angle_random - data.angle_random;
				s.image.rotation = s.direction * -1;
			}
			if (data.x_random != undefined)
			{
				s.x += Math.random() * 2 * data.x_random - data.x_random;
				s.image.x = s.x;
			}
			if (data.y_random != undefined)
			{
				s.y += Math.random() * 2 * data.y_random - data.y_random;
				s.image.y = s.y;
			}

			// variations pour les tirs multiples
			if (data.angle_gap != undefined)
			{
				s.direction += Math.floor((b + 1) / 2) * data.angle_gap * (b % 2 == 1 ? 1 : -1) - (data.number % 2 == 0 ? data.angle_gap * 0.5 : 0);
				s.image.rotation = s.direction * -1;
			}
			if (data.x_gap != undefined)
			{
				s.x += Math.floor((b + 1) / 2) * data.x_gap * (b % 2 == 1 ? 1 : -1) - (data.number % 2 == 0 ? data.x_gap * 0.5 : 0);
				s.image.x = s.x;
			}
			if (data.y_gap != undefined)
			{
				s.y += Math.floor((b + 1) / 2) * data.y_gap * (b % 2 == 1 ? 1 : -1) - (data.number % 2 == 0 ? data.y_gap * 0.5 : 0);
				s.image.y = s.y;
			}

			// variations pour les tirs répétés
			if (repeats_left != undefined)
			{
				if (data.repeat_angle != undefined)
				{
					s.direction += repeats_done * data.repeat_angle;
					s.image.rotation = s.direction * -1;
				}
				if (data.repeat_x != undefined)
				{
					s.x += repeats_done * data.repeat_x;
					s.image.x = s.x;
				}
				if (data.repeat_y != undefined)
				{
					s.y += repeats_done * data.repeat_y;
					s.image.y = s.y;
				}
				if (data.repeat_size != undefined)
				{
					s.size += repeats_done * data.repeat_size / 100;
					s.width = s.image.getBounds().width * s.size;
					s.height = s.image.getBounds().height * s.size;
					s.image.scaleX = s.size;
					s.image.scaleY = s.size;
					s.radius = s.width / 2;
				}
				if (data.repeat_speed != undefined)
				{
					s.speed += repeats_done * data.repeat_speed / 100;
				}
			}

			// autres
			if (data.image == undefined || noBulletRotation.indexOf(data.image % 100) > -1)
				s.image.rotation = 0;

			if (b == 0)
				playSound = s.sound;
		}
	}

	// son
	if (playSound != 1)
		createjs.Sound.play("shot" + (playSound - 1));

	// suite
	if (repeats_left == undefined)
	{
		repeats_left = times;
		repeats_done = 0;
		data2 = copyMap(data);

		// préparation prochaine attaque
		if (data2.next_health != undefined && data2.next_random == undefined && data2.next_id == undefined)
			data2.next_id = data2.next_health[Math.floor((enemy.maxHp - enemy.hp) / enemy.maxHp * data2.next_health.length)];

		if (data2.next_random != undefined && data2.next_id == undefined)
			data2.next_id = data2.next_random[Math.floor(Math.random() * data2.next_random.length)];

		if (data2.next_id != undefined)
		{
			data2 = this.attacks[data2.next_id];

			if (data.next_delay == undefined)
				data.next_delay = 0;

			if (data.next_delay == 0)
				bs.shoot(data2);
			else if (data.next_delay > 0)
			{
				schedule(data.next_delay + 1, function(arg)
				{
					bs.shoot(bs.attacks[arg]);
				}, data2.id);
			}
		}
	}

	// répétition attaque actuelle
	if (repeats_left > 0)
	{
		schedule((data.repeat_delay != undefined ? data.repeat_delay : defRepeatDelay) + 1, function()
		{
			bs.shoot(data, repeats_left - 1, repeats_done + 1, repeat_shot);
		});
	}
}