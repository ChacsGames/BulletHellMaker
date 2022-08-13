function LevelPreview(num, stars)
{
	if (maxStarsGoal(num + 1) == 'p')
		perfectText = "pg_g_pc2";
	if (maxStarsGoal(num + 1) == 'i')
		perfectText = "pg_g_ni2";
	if (maxStarsGoal(num + 1) == 'c')
		perfectText = "pg_g_c12";
	if (maxStarsGoal(num + 1) == '0')
		perfectText = "pg_g_d02";
	if (maxStarsGoal(num + 1) == '1')
		perfectText = "pg_g_d12";
	if (maxStarsGoal(num + 1) == '2')
		perfectText = "pg_g_d22";
	if (maxStarsGoal(num + 1) == '3')
		perfectText = "pg_g_d32";

	if (haxLevels)
		stars = 3;

	numA = (num + 1 > codes.length / 2 ? num + 1 - codes.length / 2 : num + 1);

	this.x = 50;
	this.y = 190;
	this.width = canvas.width - this.x * 2;
	this.height = canvas.height - this.y * 2;

	this.background = new createjs.Shape();
	this.background.name = "saveandload background1";
	this.background.graphics.beginFill("#0006").drawRect(0, 0, canvas.width, canvas.height);

	this.shape = new createjs.Shape();
	this.shape.name = "saveandload background2";
	this.shape.graphics.setStrokeStyle(3).beginStroke("#9ab").beginFill("#678").drawRect(this.x, this.y, this.width, this.height);

	if (!/MSIE|Trident/.test(window.navigator.userAgent))
		stage.addChild(this.background);

	this.title = new createjs.Text(text.get("pg_lv") + " " + numA + " - " + text.get("l_" + (num + 1)), font, "#2f9");
	this.title.name = "levelpreview win1";
	this.title.x = canvas.width / 2;
	this.title.y = this.y + 20;
	this.title.textAlign = "center";

	this.image = new createjs.Bitmap(loader.getResult("enemy preview lv" + numA));
	this.image.name = "levelpreview image";
	this.image.x = this.x + 30;
	this.image.y = this.y + 50;

	this.win1 = new createjs.Text(text.get("pg_g_win2"), font, stars > 0 ? "#fff" : "#000");
	this.win1.name = "levelpreview win1";
	this.win1.x = this.x + 210;
	this.win1.y = this.y + 60;

	this.win2 = new createjs.Text(text.get("pg_g_flw2"), font, stars > 1 ? "#fff" : "#000");
	this.win2.name = "levelpreview win2";
	this.win2.x = this.x + 210;
	this.win2.y = this.y + 95;

	this.win3 = new createjs.Text(text.get(perfectText), font, stars == 3 ? "#fff" : "#000");
	this.win3.name = "levelpreview win3";
	this.win3.x = this.x + 210;
	this.win3.y = this.y + 130 - (text.get(perfectText).indexOf('\n') > 0 ? 8 : 0);
	this.win3.lineHeight = 17;

	this.star1 = new createjs.Bitmap(loader.getResult("star " + (stars > 0 ? 1 : 2)));
	this.star1.name = "levelpreview star1";
	this.star1.x = this.x + 165;
	this.star1.y = this.y + 52;

	this.star2 = new createjs.Bitmap(loader.getResult("star " + (stars > 1 ? 1 : 2)));
	this.star2.name = "levelpreview star2";
	this.star2.x = this.x + 165;
	this.star2.y = this.y + 87;

	this.star3 = new createjs.Bitmap(loader.getResult("star " + (stars == 3 ? 1 : 2)));
	this.star3.name = "levelpreview star3";
	this.star3.x = this.x + 165;
	this.star3.y = this.y + 122;

	stage.addChild(this.shape, this.title, this.image, this.win1, this.win2, this.win3, this.star1, this.star2, this.star3);

	this.close = new Button(text.get("ie_c"), this.x + this.width - 60, this.y + this.height - 35, 80, "#ace");
	this.close.label.on("click", function(event)
	{
		levelPreview.kill();
	});

	this.play = new Button(text.get("m_e_pl"), canvas.width / 2, this.y + this.height - 35, 80, "#ace");
	this.play.label.on("click", function(event)
	{
		levelPreview.kill();

		levelNum = num + 1;
		play(codes[num]);
	});

	this.edit = new Button(text.get("m_l_ed"), this.x + 60, this.y + this.height - 35, 80, stars < 1 ? "#89a" : "#ace");
	this.edit.label.on("click", function(event)
	{
		if (stars < 1)
			createjs.Sound.play("shot2");
		else
		{
			levelPreview.kill();

			openEditor();
			editor.fullCode = JSON.parse(codes[num]);
			editor.writeData(true);
		}
	});
}

LevelPreview.prototype.kill = function()
{
	this.close.kill();
	this.play.kill();
	this.edit.kill();
	stage.removeChild(this.background);
	stage.removeChild(this.shape, this.title, this.image, this.win1, this.win2, this.win3, this.star1, this.star2, this.star3);

	levelPreview = undefined;
}

LevelPreview.prototype.toString = function()
{
	return "LevelPreview";
}